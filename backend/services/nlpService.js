import natural from 'natural';

// Initializing tools
const classifier = new natural.BayesClassifier();
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

/**
 * Pre-train the classifier with basic department keywords
 * In a production app, you might load this from a JSON file or DB
 */
const trainClassifier = () => {
  // Water Department keywords
  classifier.addDocument('water leak pipe supply drainage sewage', 'Water');
  classifier.addDocument('dirty water low pressure no water supply', 'Water');
  
  // Electricity Department
  classifier.addDocument('power cut electricity bill spark wire transformer', 'Electricity');
  classifier.addDocument('voltage fluctuation meter not working', 'Electricity');
  
  // Road/Infrastructure
  classifier.addDocument('pothole road broken street light pavement construction', 'Road');
  
  classifier.train();
};

// Run training once when service starts
trainClassifier();

/**
 * Service to analyze complaint text
 */
export const analyzeComplaint = (text) => {
  if (!text) return { sentiment: 0, suggestedDept: 'General', priority: 'Medium' };

  const tokens = tokenizer.tokenize(text);
  
  // 1. Get Sentiment Score (-5 to 5)
  const sentimentScore = analyzer.getSentiment(tokens);
  
  // 2. Predict Department
  const suggestedDept = classifier.classify(text);

  // 3. Determine Priority based on sentiment
  let priority = 'Medium';
  if (sentimentScore <= -2) priority = 'High'; // Very negative/urgent language
  if (sentimentScore > 1) priority = 'Low';

  return {
    sentimentScore,
    suggestedDept,
    priority,
    isUrgent: sentimentScore <= -3
  };
};