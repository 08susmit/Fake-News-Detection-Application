// Application data and configuration
const analysisData = {
  sampleResults: [
    {
      reliabilityScore: 87,
      riskLevel: "Trusted - Highly Reliable",
      sentimentAnalysis: {
        bias: "Neutral",
        emotionalTone: "Informative",
        languagePatterns: "Professional terminology, balanced reporting"
      },
      factChecking: {
        claimsDetected: [
          "Study published in peer-reviewed journal",
          "Data from government statistics", 
          "Expert opinions cited with credentials"
        ],
        sourceVerification: "Multiple trusted academic sources",
        similarArticles: "Corroborated by Reuters, AP News"
      },
      sourceCredibility: {
        domainAuthority: 92,
        publicationHistory: "Established publication with editorial oversight",
        editorialStandards: "High",
        transparencyScore: 89
      }
    },
    {
      reliabilityScore: 34,
      riskLevel: "High Risk - Likely Fake",
      sentimentAnalysis: {
        bias: "Heavily Biased",
        emotionalTone: "Sensational/Angry", 
        languagePatterns: "Inflammatory language, clickbait indicators"
      },
      factChecking: {
        claimsDetected: [
          "Unverified shocking statistics",
          "Anonymous sources only",
          "Claims contradicted by fact-checkers"
        ],
        sourceVerification: "No credible sources provided",
        similarArticles: "Flagged by Snopes, PolitiFact as false"
      },
      sourceCredibility: {
        domainAuthority: 23,
        publicationHistory: "Recently created domain, no editorial oversight", 
        editorialStandards: "Low",
        transparencyScore: 15
      }
    },
    {
      reliabilityScore: 52,
      riskLevel: "Medium Risk - Verify Sources",
      sentimentAnalysis: {
        bias: "Slightly Biased",
        emotionalTone: "Opinion-based",
        languagePatterns: "Mix of factual and opinion content"
      },
      factChecking: {
        claimsDetected: [
          "Some verifiable facts mixed with opinions",
          "Limited source citations",
          "Partial corroboration found"
        ],
        sourceVerification: "Mixed reliability of sources",
        similarArticles: "Similar coverage by mainstream outlets with different angles"
      },
      sourceCredibility: {
        domainAuthority: 67,
        publicationHistory: "Established but opinion-focused publication",
        editorialStandards: "Moderate",
        transparencyScore: 58
      }
    }
  ]
};

// DOM elements
let articleInput;
let charCount;
let analyzeBtn;
let tryAnotherBtn;
let loadingSection;
let resultsSection;
let analysisTypeButtons;
let currentAnalysisType = 'text';

// Store validator function reference for proper removal
let urlValidator;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  addEnhancedAnimations();
});

function initializeElements() {
  articleInput = document.getElementById('articleInput');
  charCount = document.getElementById('charCount');
  analyzeBtn = document.getElementById('analyzeBtn');
  tryAnotherBtn = document.getElementById('tryAnotherBtn');
  loadingSection = document.getElementById('loadingSection');
  resultsSection = document.getElementById('resultsSection');
  analysisTypeButtons = document.querySelectorAll('.analysis-type');
}

function setupEventListeners() {
  // Character count
  articleInput.addEventListener('input', updateCharCount);
  
  // Analysis type switching
  analysisTypeButtons.forEach(button => {
    button.addEventListener('click', function() {
      switchAnalysisType(this.dataset.type);
    });
  });
  
  // Analyze button
  analyzeBtn.addEventListener('click', startAnalysis);
  
  // Try another button
  tryAnotherBtn.addEventListener('click', resetInterface);
  
  // Copy results button
  document.getElementById('copyResultsBtn').addEventListener('click', copyResults);
  
  // Initial char count
  updateCharCount();
}

function addEnhancedAnimations() {
  // Add staggered animation to cards - Fixed template literal
  const cards = document.querySelectorAll('.colorful-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${(index * 0.1).toFixed(2)}s`;
  });
  
  // Add hover sound effect (visual feedback)
  const interactiveElements = document.querySelectorAll('.btn, .colorful-card, .cred-item');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transition = 'all 0.25s ease-out';
    });
  });
}

function updateCharCount() {
  const count = articleInput.value.length;
  charCount.textContent = count;
  
  // Update analyze button state with enhanced styling
  if (count > 0) {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.add('gradient-btn');
    if (currentAnalysisType === 'url') {
      analyzeBtn.textContent = 'Analyze URL';
    } else {
      analyzeBtn.textContent = 'Analyze Article';
    }
  } else {
    analyzeBtn.disabled = true;
    analyzeBtn.classList.remove('gradient-btn');
    if (currentAnalysisType === 'url') {
      analyzeBtn.textContent = 'Enter URL to analyze';
    } else {
      analyzeBtn.textContent = 'Enter text to analyze';
    }
  }
  
  // Update character count color based on length
  const charCountElement = document.querySelector('.char-count');
  if (count > 4000) {
    charCountElement.style.background = 'rgba(var(--color-error-rgb), 0.15)';
    charCountElement.style.color = 'var(--color-error)';
  } else if (count > 2000) {
    charCountElement.style.background = 'rgba(var(--color-warning-rgb), 0.15)';
    charCountElement.style.color = 'var(--color-warning)';
  } else {
    charCountElement.style.background = 'var(--color-bg-1)';
    charCountElement.style.color = 'var(--color-text-secondary)';
  }
}

// Fixed validateURL function with proper reference
function validateURL() {
  const input = articleInput.value.trim();
  const urlPattern = /^https?:\/\/.+/i;
  
  if (input && !urlPattern.test(input)) {
    articleInput.classList.add('error');
    articleInput.classList.remove('success');
    articleInput.style.borderColor = 'var(--color-error)';
  } else if (input) {
    articleInput.classList.add('success');
    articleInput.classList.remove('error');
    articleInput.style.borderColor = 'var(--color-success)';
  } else {
    articleInput.classList.remove('error', 'success');
    articleInput.style.borderColor = 'var(--color-border)';
  }
}

function switchAnalysisType(type) {
  currentAnalysisType = type;
  
  // Update button states with smooth animation
  analysisTypeButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.type === type) {
      btn.classList.add('active');
      // Add a little bounce effect
      btn.style.transform = 'scale(1.05)';
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);
    }
  });
  
  // Clear existing input
  articleInput.value = '';
  updateCharCount();
  
  // Always remove existing validator before adding new one
  if (urlValidator) {
    articleInput.removeEventListener('input', urlValidator);
  }
  
  // Update input field properties and placeholder text
  if (type === 'url') {
    articleInput.rows = 3;
    articleInput.placeholder = 'Enter article URL for analysis...\n\nExample: https://example-news.com/breaking-story\nhttps://reliable-source.org/scientific-study';
    articleInput.style.fontFamily = 'var(--font-family-mono)';
    
    // Store reference and add URL validation styling
    urlValidator = validateURL;
    articleInput.addEventListener('input', urlValidator);
  } else {
    articleInput.rows = 8;
    articleInput.placeholder = 'Paste your article text here for analysis...\n\nExample: \'Breaking: Scientists discover revolutionary cure that doctors don\'t want you to know about! This simple trick will shock you and change everything. Anonymous sources confirm this amazing breakthrough that pharmaceutical companies are trying to hide from the public.\'';
    articleInput.style.fontFamily = 'var(--font-family-base)';
    
    // Remove validation classes
    articleInput.classList.remove('error', 'success');
    articleInput.style.borderColor = 'var(--color-border)';
    urlValidator = null;
  }
  
  // Hide results if they were showing
  if (!resultsSection.classList.contains('hidden')) {
    resultsSection.classList.add('hidden');
  }
}

function startAnalysis() {
  const inputText = articleInput.value.trim();
  
  if (inputText.length === 0) {
    return;
  }
  
  // Validate input
  const validation = validateInput(inputText);
  if (!validation.valid) {
    showNotification(validation.message, 'error');
    return;
  }
  
  // Validate URL if in URL mode
  if (currentAnalysisType === 'url') {
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(inputText)) {
      showNotification('Please enter a valid URL starting with http:// or https://', 'error');
      return;
    }
  }
  
  // Add button loading state
  analyzeBtn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    analyzeBtn.style.transform = 'scale(1)';
  }, 150);
  
  // Hide results and show loading
  resultsSection.classList.add('hidden');
  loadingSection.classList.remove('hidden');
  analyzeBtn.disabled = true;
  
  // Update loading text based on analysis type
  const loadingContent = loadingSection.querySelector('.loading-content');
  const loadingTitle = loadingContent.querySelector('h3');
  const loadingDesc = loadingContent.querySelector('p');
  
  if (currentAnalysisType === 'url') {
    loadingTitle.textContent = 'Analyzing URL...';
    loadingDesc.textContent = 'Fetching content, checking domain reputation, and analyzing article...';
  } else {
    loadingTitle.textContent = 'Analyzing Article...';
    loadingDesc.textContent = 'Checking sources, analyzing sentiment, and verifying claims...';
  }
  
  // Simulate analysis delay with progress updates
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 200);
  
  setTimeout(() => {
    clearInterval(progressInterval);
    const results = generateAnalysisResults(inputText);
    displayResults(results);
    
    // Hide loading and show results with staggered animation
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    analyzeBtn.disabled = false;
    
    // Animate cards appearing
    const resultCards = resultsSection.querySelectorAll('.colorful-card');
    resultCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }, 3500);
}

function generateAnalysisResults(inputText) {
  let selectedResult;
  
  if (currentAnalysisType === 'url') {
    // Analyze URL characteristics
    const url = inputText.toLowerCase();
    selectedResult = generateURLAnalysis(url);
  } else {
    // Analyze text characteristics
    selectedResult = generateTextAnalysis(inputText);
  }
  
  return selectedResult;
}

function generateURLAnalysis(url) {
  let selectedResult;
  
  // Check domain characteristics for URL analysis
  const trustedDomains = ['reuters.com', 'ap.org', 'bbc.com', 'npr.org', 'pbs.org', 'gov', '.edu', 'nature.com', 'science.org'];
  const suspiciousDomains = ['breaking-news', 'real-truth', 'secret-info', 'leaked', 'shocking'];
  
  const isTrusted = trustedDomains.some(domain => url.includes(domain));
  const isSuspicious = suspiciousDomains.some(domain => url.includes(domain));
  
  if (isTrusted) {
    selectedResult = { ...analysisData.sampleResults[0] };
    selectedResult.reliabilityScore = 85 + Math.floor(Math.random() * 10);
    selectedResult.factChecking.claimsDetected = [
      "Content from established news organization",
      "Domain has strong editorial standards",
      "URL structure indicates professional journalism"
    ];
  } else if (isSuspicious) {
    selectedResult = { ...analysisData.sampleResults[1] };
    selectedResult.reliabilityScore = 15 + Math.floor(Math.random() * 25);
    selectedResult.factChecking.claimsDetected = [
      "Domain name contains sensational keywords",
      "URL structure suggests clickbait content",
      "Domain not recognized as established news source"
    ];
  } else {
    selectedResult = { ...analysisData.sampleResults[2] };
    selectedResult.reliabilityScore = 40 + Math.floor(Math.random() * 25);
    selectedResult.factChecking.claimsDetected = [
      "Domain analysis shows mixed reliability indicators",
      "URL requires further verification",
      "Content source needs additional fact-checking"
    ];
  }
  
  // Update risk level based on score
  updateRiskLevel(selectedResult);
  
  return selectedResult;
}

function generateTextAnalysis(inputText) {
  // Analyze input characteristics to determine which sample result to use
  const text = inputText.toLowerCase();
  const hasEmotionalWords = /shocking|amazing|incredible|unbelievable|secret|hidden|doctors hate|you won't believe|breaking|urgent|exclusive|leaked|scandal/.test(text);
  const hasClickbait = /this will|you need to|must see|won't believe|shocking truth|simple trick|one weird/.test(text);
  // Fixed regex: escaped the dot in peer.reviewed
  const hasCredibleWords = /study|research|according to|professor|university|published|peer\.reviewed|data shows/.test(text);
  const hasAnonymousSources = /anonymous|sources say|unnamed|insider|leaked|rumor/.test(text);
  const textLength = inputText.length;
  
  let selectedResult;
  
  // Determine result type based on content analysis
  if (hasCredibleWords && textLength > 200 && !hasEmotionalWords) {
    // High reliability - academic/professional content
    selectedResult = { ...analysisData.sampleResults[0] };
    selectedResult.reliabilityScore = 85 + Math.floor(Math.random() * 10);
  } else if (hasEmotionalWords && hasClickbait && hasAnonymousSources) {
    // Low reliability - sensational content
    selectedResult = { ...analysisData.sampleResults[1] };
    selectedResult.reliabilityScore = 15 + Math.floor(Math.random() * 25);
  } else {
    // Medium reliability - mixed content
    selectedResult = { ...analysisData.sampleResults[2] };
    selectedResult.reliabilityScore = 40 + Math.floor(Math.random() * 25);
  }
  
  // Extract some claims from the actual input text
  selectedResult.factChecking.claimsDetected = extractClaims(inputText);
  
  // Update risk level based on score
  updateRiskLevel(selectedResult);
  
  return selectedResult;
}

function updateRiskLevel(result) {
  if (result.reliabilityScore >= 86) {
    result.riskLevel = "Trusted - Highly Reliable";
  } else if (result.reliabilityScore >= 61) {
    result.riskLevel = "Low Risk - Generally Reliable";
  } else if (result.reliabilityScore >= 31) {
    result.riskLevel = "Medium Risk - Verify Sources";
  } else {
    result.riskLevel = "High Risk - Likely Fake";
  }
}

function extractClaims(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const claims = [];
  
  // Take up to 3 key sentences as claims
  for (let i = 0; i < Math.min(3, sentences.length); i++) {
    let claim = sentences[i].trim();
    if (claim.length > 100) {
      claim = claim.substring(0, 97) + '...';
    }
    claims.push(claim);
  }
  
  // If no good sentences found, use generic claims
  if (claims.length === 0) {
    claims.push("Content analysis completed");
    claims.push("Source verification performed");
  }
  
  return claims;
}

function displayResults(results) {
  // Update reliability score with enhanced animation
  updateScoreDisplay(results.reliabilityScore, results.riskLevel);
  
  // Update sentiment analysis
  document.getElementById('biasResult').textContent = results.sentimentAnalysis.bias;
  document.getElementById('toneResult').textContent = results.sentimentAnalysis.emotionalTone;
  document.getElementById('languageResult').textContent = results.sentimentAnalysis.languagePatterns;
  
  // Update fact checking with enhanced styling
  const claimsList = document.getElementById('claimsList');
  claimsList.innerHTML = '';
  results.factChecking.claimsDetected.forEach((claim, index) => {
    const li = document.createElement('li');
    li.textContent = claim;
    li.style.opacity = '0';
    li.style.transform = 'translateX(-10px)';
    claimsList.appendChild(li);
    
    // Animate each claim appearing
    setTimeout(() => {
      li.style.transition = 'all 0.3s ease-out';
      li.style.opacity = '1';
      li.style.transform = 'translateX(0)';
    }, index * 100);
  });
  
  document.getElementById('sourceVerification').textContent = results.factChecking.sourceVerification;
  document.getElementById('similarArticles').textContent = results.factChecking.similarArticles;
  
  // Update source credibility with number animation
  animateNumber('domainAuth', results.sourceCredibility.domainAuthority);
  animateNumber('transparency', results.sourceCredibility.transparencyScore);
  document.getElementById('editorialStd').textContent = results.sourceCredibility.editorialStandards;
  document.getElementById('pubHistory').textContent = results.sourceCredibility.publicationHistory;
}

function animateNumber(elementId, targetNumber) {
  const element = document.getElementById(elementId);
  let currentNumber = 0;
  const increment = targetNumber / 30;
  
  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(timer);
    }
    element.textContent = Math.round(currentNumber);
  }, 50);
}

function updateScoreDisplay(score, riskLevel) {
  const scoreNumber = document.getElementById('scoreNumber');
  const riskLevelElement = document.getElementById('riskLevel');
  const scoreCircle = document.getElementById('scoreCircle');
  
  // Animate score counting up with enhanced easing
  animateScoreEnhanced(scoreNumber, score);
  
  // Update risk level text and styling
  riskLevelElement.textContent = riskLevel;
  
  // Remove existing risk classes
  riskLevelElement.classList.remove('risk-high', 'risk-medium', 'risk-low', 'risk-trusted');
  
  // Fixed color mapping - risk-low now uses success colors
  let colorClass, circleColor;
  if (score >= 86) {
    colorClass = 'risk-trusted';
    circleColor = 'var(--color-success)';
  } else if (score >= 61) {
    colorClass = 'risk-low';
    circleColor = 'var(--color-success)'; // Changed from warning to success
  } else if (score >= 31) {
    colorClass = 'risk-medium';
    circleColor = 'var(--color-warning)';
  } else {
    colorClass = 'risk-high';
    circleColor = 'var(--color-error)';
  }
  
  riskLevelElement.classList.add(colorClass);
  
  // Fixed template literal for CSS property
  const percentage = (score / 100) * 360;
  scoreCircle.style.setProperty('--score-percentage', `${percentage}deg`);
  scoreCircle.style.setProperty('--score-color', circleColor);
  
  // Add pulse effect to risk level
  setTimeout(() => {
    riskLevelElement.style.animation = 'pulse 0.6s ease-out';
  }, 1000);
}

function animateScoreEnhanced(element, targetScore) {
  let currentScore = 0;
  const duration = 1500;
  const startTime = Date.now();
  
  function updateScore() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use easing function for smooth animation
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    currentScore = Math.round(targetScore * easedProgress);
    
    element.textContent = currentScore;
    
    if (progress < 1) {
      requestAnimationFrame(updateScore);
    }
  }
  
  requestAnimationFrame(updateScore);
}

function resetInterface() {
  // Add exit animation before clearing
  const resultCards = resultsSection.querySelectorAll('.colorful-card');
  resultCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.transition = 'all 0.3s ease-out';
      card.style.opacity = '0';
      card.style.transform = 'translateY(-20px)';
    }, index * 50);
  });
  
  setTimeout(() => {
    // Clear input
    articleInput.value = '';
    updateCharCount();
    
    // Remove validation classes
    articleInput.classList.remove('error', 'success');
    articleInput.style.borderColor = 'var(--color-border)';
    
    // Hide results
    resultsSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    
    // Reset button state
    analyzeBtn.disabled = true;
    
    // Focus on input
    articleInput.focus();
    
    // Scroll to top of input section
    document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Interface reset. Ready for new analysis!', 'success');
  }, 300);
}

function copyResults() {
  const score = document.getElementById('scoreNumber').textContent;
  const riskLevel = document.getElementById('riskLevel').textContent;
  const bias = document.getElementById('biasResult').textContent;
  const tone = document.getElementById('toneResult').textContent;
  const sourceVerification = document.getElementById('sourceVerification').textContent;
  
  const analysisTypeText = currentAnalysisType === 'url' ? 'URL Analysis' : 'Text Analysis';
  const timestamp = new Date().toLocaleString();
  
  const resultsText = `
FakeNews Detector Analysis Results (${analysisTypeText})
=============================================

Reliability Score: ${score}%
Risk Level: ${riskLevel}

Sentiment Analysis:
- Bias Detection: ${bias}
- Emotional Tone: ${tone}

Source Verification: ${sourceVerification}

Analysis Date: ${timestamp}
Generated by FakeNews Detector - Verify Before You Share
Created by Team Bug Crew
  `.trim();
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(resultsText).then(() => {
      showCopyFeedback();
    }).catch(() => {
      fallbackCopy(resultsText);
    });
  } else {
    fallbackCopy(resultsText);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback();
  } catch (err) {
    console.error('Copy failed:', err);
  }
  
  document.body.removeChild(textArea);
}

function showCopyFeedback() {
  const copyBtn = document.getElementById('copyResultsBtn');
  const originalText = copyBtn.textContent;
  
  copyBtn.textContent = 'Copied!';
  copyBtn.classList.add('copied');
  copyBtn.style.background = 'linear-gradient(135deg, var(--color-success), var(--color-teal-400))';
  copyBtn.style.color = 'var(--color-btn-primary-text)';
  copyBtn.style.transform = 'scale(1.05)';
  
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.classList.remove('copied');
    copyBtn.style.background = '';
    copyBtn.style.color = '';
    copyBtn.style.transform = 'scale(1)';
  }, 2000);
}

// Fixed template literal for notification className
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  `;
  
  if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, var(--color-error), var(--color-red-400))';
  } else if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, var(--color-success), var(--color-teal-400))';
  } else {
    notification.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-teal-500))';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Enhanced input validation
function validateInput(text) {
  if (text.length < 10) {
    return { valid: false, message: 'Please enter at least 10 characters for analysis.' };
  }
  
  if (text.length > 5000) {
    return { valid: false, message: 'Text is too long. Please limit to 5000 characters.' };
  }
  
  return { valid: true };
}

// Add enhanced error handling
window.addEventListener('error', function(event) {
  console.error('Application error:', event.error);
  
  // Hide loading if there's an error
  if (loadingSection && !loadingSection.classList.contains('hidden')) {
    loadingSection.classList.add('hidden');
    analyzeBtn.disabled = false;
    showNotification('An error occurred during analysis. Please try again.', 'error');
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Ctrl/Cmd + Enter to analyze
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    if (!analyzeBtn.disabled) {
      startAnalysis();
    }
    event.preventDefault();
  }
  
  // Escape to reset interface
  if (event.key === 'Escape' && !resultsSection.classList.contains('hidden')) {
    resetInterface();
    event.preventDefault();
  }
});

// Initialize enhanced UX and accessibility
function initializeEnhancedUX() {
  // Add focus management for better accessibility
  const focusableElements = document.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');
  
  focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
      this.classList.add('keyboard-focus');
    });
    
    element.addEventListener('blur', function() {
      this.classList.remove('keyboard-focus');
    });
  });
  
  // Add enhanced hover effects for cards
  const cards = document.querySelectorAll('.colorful-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add CSS animations for notifications
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Call enhanced UX initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancedUX);
} else {
  initializeEnhancedUX();
}
