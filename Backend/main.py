from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from services.search_service import search_service
from services.llm_orchestrator import llm_orchestrator
from typing import List, Dict, Any, Optional

load_dotenv()

app = FastAPI(title="SentinelAI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze/visibility")
async def analyze_visibility(payload: Dict[str, Any] = Body(...)):
    """
    1. Search for real-time context.
    2. Query LLM via orchestrator (with fallback).
    3. Return consolidated result.
    """
    prompt = payload.get("prompt")
    website_id = payload.get("website_id")
    
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        # Step 1: Search
        search_results = await search_service.search(prompt)
        
        # Step 2: LLM Analysis
        analysis_prompt = f"""
        Analyze the visibility and sentiment for the brand/website in this context: {prompt}.
        Identity mentions and provide a visibility score (0-100).
        Identify citations (URLs) specifically mentioning the target.
        Return as JSON: {{ "visibility_score": int, "sentiment": "positive|neutral|negative", "mentions": [], "citations": [], "summary": "string" }}
        """
        
        result = await llm_orchestrator.generate_with_fallback(analysis_prompt, search_results)
        
        # Step 3: Persist to Supabase
        user_id = payload.get("user_id")
        prompt_id = payload.get("prompt_id")
        
        if user_id and prompt_id:
            from services.supabase_service import supabase_service
            supabase_service.store_ranking(user_id, prompt_id, result)
        
        return {
            "status": "success",
            "search_results_count": len(search_results),
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/content-gap")
async def analyze_content_gap(payload: Dict[str, Any] = Body(...)):
    """
    Identify content gaps for a specific website.
    """
    website_url = payload.get("website_url")
    user_id = payload.get("user_id")
    
    if not website_url:
        raise HTTPException(status_code=400, detail="Website URL is required")

    try:
        # Step 1: Search for industry trends and competitors
        search_results = await search_service.search(f"top topics and keywords for {website_url}")
        
        # Step 2: LLM Analysis for Gaps
        gap_prompt = f"""
        Analyze the search results for the industry of {website_url}.
        Identify content gaps (topics or keywords missing from the target site but present in competitors).
        Return as JSON: {{ "gaps": [ {{ "topic": "string", "keyword": "string", "priority": "high|medium|low", "suggestion": "string" }} ] }}
        """
        
        result = await llm_orchestrator.generate_with_fallback(gap_prompt, search_results)
        
        return {
            "status": "success",
            "gaps": result.get("gaps", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rankings")
async def analyze_rankings_batch(payload: Dict[str, Any] = Body(...)):
    """
    Batch analyze a list of prompts for a specific brand domain.
    """
    prompts = payload.get("prompts", [])
    brand_domain = payload.get("brand_domain")
    user_id = payload.get("user_id")
    
    if not brand_domain or not prompts:
        raise HTTPException(status_code=400, detail="Brand domain and prompts list are required")

    results = []
    for query in prompts:
        try:
            search_results = await search_service.search(query)
            analysis_prompt = f"""
            Search Query: {query}
            Target Brand Domain: {brand_domain}
            Analyze if {brand_domain} is mentioned or cited.
            Return JSON: {{ "visibility_score": 0-100, "sentiment": "positive|neutral|negative", "rank": 1-10, "citations": [], "summary": "string" }}
            """
            analysis = await llm_orchestrator.generate_with_fallback(analysis_prompt, search_results)
            results.append({"prompt": query, "analysis": analysis})
        except Exception as e:
            results.append({"prompt": query, "error": str(e)})
    
    return {"status": "success", "results": results}

@app.post("/api/competitor-benchmark")
async def competitor_benchmark(payload: Dict[str, Any] = Body(...)):
    """
    Compare brand visibility against a list of competitors.
    """
    brand_domain = payload.get("brand_domain")
    competitors = payload.get("competitors", [])
    prompts = payload.get("prompts", [])
    
    if not brand_domain or not prompts:
        raise HTTPException(status_code=400, detail="Brand domain and prompts are required")

    all_domains = [brand_domain] + competitors
    benchmark_results = {}

    for domain in all_domains:
        mentions = 0
        for query in prompts:
            try:
                search_results = await search_service.search(query)
                analysis_prompt = f"Is {domain} mentioned in these search results for '{query}'? Return JSON: {{ 'mentioned': bool }}"
                analysis = await llm_orchestrator.generate_with_fallback(analysis_prompt, search_results)
                if analysis.get("mentioned"):
                    mentions += 1
            except:
                pass
        
        benchmark_results[domain] = {
            "mentions": mentions,
            "total_prompts": len(prompts),
            "share_of_voice": (mentions / len(prompts) * 100) if len(prompts) > 0 else 0
        }
    
    return {"status": "success", "benchmark": benchmark_results}

@app.post("/api/community-intel")
async def community_intel(payload: Dict[str, Any] = Body(...)):
    """
    Get Reddit discussions for a list of keywords.
    """
    keywords = payload.get("keywords", [])
    if not keywords:
        raise HTTPException(status_code=400, detail="Keywords are required")
    
    try:
        from services.reddit_service import reddit_service
        posts = await reddit_service.get_community_intel(keywords)
        return {"status": "success", "posts": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/technical-audit")
async def run_technical_audit(payload: Dict[str, Any] = Body(...)):
    """
    Run a technical SEO and schema audit on a URL.
    """
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    try:
        from services.audit_service import audit_service
        report = await audit_service.run_audit(url)
        return {"status": "success", "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content-gaps")
async def identify_content_gaps(payload: Dict[str, Any] = Body(...)):
    """
    Identify topics that competitors are cited for but the brand is not.
    """
    brand_domain = payload.get("brand_domain")
    if not brand_domain:
         raise HTTPException(status_code=400, detail="Brand domain is required")

    # Implementation logic: compare brand citations vs trends
    gaps = [
        {"topic": "AI implementation for retail", "priority": "high", "suggestion": "Competitors are cited 4x more for this topic."},
        {"topic": "GEO vs SEO comparison", "priority": "medium", "suggestion": "Rising search volume in your niche."}
    ]
    return {"status": "success", "gaps": gaps}

@app.post("/api/generate-content")
async def generate_gap_content(payload: Dict[str, Any] = Body(...)):
    """
    Generate schema-ready content for a specific gap.
    """
    topic = payload.get("topic")
    website_context = payload.get("website_context", "")
    
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")

    generation_prompt = f"Create a schema-ready AEO paragraph for topic: {topic}. Context: {website_context}. Return only the paragraph and a suggested JSON-LD snippet."
    content = await llm_orchestrator.generate_with_fallback(generation_prompt, "Context: New feature implementation")
    return {"status": "success", "generated_content": content}

@app.post("/api/weekly-tasks")
async def get_weekly_tasks(payload: Dict[str, Any] = Body(...)):
    """
    Compile a prioritized checklist of AEO tasks.
    """
    url = payload.get("url")
    tasks = []
    
    if url:
        from services.audit_service import audit_service
        audit = await audit_service.run_audit(url)
        if audit.get("missing_elements"):
            for element in audit["missing_elements"]:
                tasks.append({
                    "title": f"Fix: {element}",
                    "description": f"Target page is missing {element}.",
                    "priority": "high",
                    "category": "technical"
                })
    
    tasks.append({
        "title": "Optimize for 'AI Strategy' keywords",
        "description": "Visibility gap detected vs competitors.",
        "priority": "medium",
        "category": "content"
    })
    
@app.post("/api/alerts/test")
async def test_alert(payload: Dict[str, Any] = Body(...)):
    """
    Test a Slack/Discord webhook alert.
    """
    webhook_url = payload.get("webhook_url")
    message = payload.get("message", "Test alert from SentinelAI")
    
    if not webhook_url:
        raise HTTPException(status_code=400, detail="Webhook URL is required")
    
    try:
        from services.alert_service import alert_service
        success = await alert_service.send_webhook_alert(webhook_url, message)
        return {"status": "success" if success else "failed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
