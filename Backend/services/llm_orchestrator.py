from services.llm_providers import OpenAIProvider, GeminiProvider, AnthropicProvider, GroqProvider, LLMProvider, MockProvider
from typing import List, Dict, Any, Optional
import os
import logging

class LLMOrchestrator:
    def __init__(self):
        self.providers: List[LLMProvider] = []
        
        # Initialize providers based on available keys (skip placeholders)
        def is_valid(key):
            return key and not key.startswith("your_")

        if is_valid(os.getenv("OPENAI_API_KEY")):
            self.providers.append(OpenAIProvider(os.getenv("OPENAI_API_KEY")))
        if is_valid(os.getenv("GEMINI_API_KEY")):
            self.providers.append(GeminiProvider(os.getenv("GEMINI_API_KEY")))
        if is_valid(os.getenv("ANTHROPIC_API_KEY")):
            self.providers.append(AnthropicProvider(os.getenv("ANTHROPIC_API_KEY")))
        if is_valid(os.getenv("GROQ_API_KEY")):
            self.providers.append(GroqProvider(os.getenv("GROQ_API_KEY")))
        
        # Always add MockProvider for development fallback
        self.providers.append(MockProvider())

    async def generate_with_fallback(self, prompt: str, search_context: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Attempt to generate a response using providers in order of priority.
        """
        errors = []
        for provider in self.providers:
            try:
                return await provider.generate_response(prompt, search_context)
            except Exception as e:
                logging.error(f"Provider {provider.__class__.__name__} failed: {str(e)}")
                errors.append({"provider": provider.__class__.__name__, "error": str(e)})
        
        raise Exception(f"All LLM providers failed. Errors: {errors}")

llm_orchestrator = LLMOrchestrator()
