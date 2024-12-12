const corsOptions = {
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};
  
  const CHATPULSE_TOKEN = "ChatPulse-token";
  
  export { corsOptions, CHATPULSE_TOKEN };
