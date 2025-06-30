export class AccessibilityChecker {
  static analyzeGame(gameData: any, files: Record<string, string>) {
    const issues: Array<{
      type: 'error' | 'warning' | 'info';
      category: string;
      message: string;
      suggestion: string;
    }> = [];

    // Check HTML structure
    this.checkHTMLAccessibility(files['index.html'] || '', issues);
    
    // Check CSS for accessibility
    this.checkCSSAccessibility(files['style.css'] || '', issues);
    
    // Check game mechanics
    this.checkGameMechanics(gameData, issues);
    
    // Check color contrast
    this.checkColorContrast(files, issues);
    
    // Check keyboard navigation
    this.checkKeyboardNavigation(files['game.js'] || '', issues);

    return {
      issues,
      score: this.calculateAccessibilityScore(issues),
      recommendations: this.generateRecommendations(issues)
    };
  }

  private static checkHTMLAccessibility(html: string, issues: any[]) {
    // Check for alt text on images
    if (html.includes('<img') && !html.includes('alt=')) {
      issues.push({
        type: 'error',
        category: 'Images',
        message: 'Images missing alt text',
        suggestion: 'Add descriptive alt attributes to all images for screen readers'
      });
    }

    // Check for proper heading structure
    if (!html.includes('<h1')) {
      issues.push({
        type: 'warning',
        category: 'Structure',
        message: 'Missing main heading (h1)',
        suggestion: 'Add a descriptive h1 element to provide page structure'
      });
    }

    // Check for semantic HTML
    if (!html.includes('<main') && !html.includes('<section') && !html.includes('<article')) {
      issues.push({
        type: 'info',
        category: 'Semantics',
        message: 'Consider using semantic HTML elements',
        suggestion: 'Use <main>, <section>, <article> for better document structure'
      });
    }

    // Check for focus management
    if (!html.includes('tabindex') && html.includes('<button')) {
      issues.push({
        type: 'info',
        category: 'Focus',
        message: 'Consider explicit focus management',
        suggestion: 'Add tabindex attributes to control focus order'
      });
    }
  }

  private static checkCSSAccessibility(css: string, issues: any[]) {
    // Check for focus indicators
    if (!css.includes(':focus') && !css.includes('focus-visible')) {
      issues.push({
        type: 'warning',
        category: 'Focus',
        message: 'Missing focus indicators',
        suggestion: 'Add :focus styles to make keyboard navigation visible'
      });
    }

    // Check for reduced motion support
    if (!css.includes('prefers-reduced-motion')) {
      issues.push({
        type: 'info',
        category: 'Motion',
        message: 'No reduced motion support',
        suggestion: 'Add @media (prefers-reduced-motion: reduce) to respect user preferences'
      });
    }

    // Check for high contrast support
    if (!css.includes('prefers-contrast')) {
      issues.push({
        type: 'info',
        category: 'Contrast',
        message: 'No high contrast support',
        suggestion: 'Add @media (prefers-contrast: high) for better accessibility'
      });
    }
  }

  private static checkGameMechanics(gameData: any, issues: any[]) {
    // Check for alternative input methods
    if (!gameData.controls?.alternative) {
      issues.push({
        type: 'warning',
        category: 'Input',
        message: 'Limited input methods',
        suggestion: 'Provide alternative input methods (mouse, touch, keyboard alternatives)'
      });
    }

    // Check for difficulty options
    if (!gameData.difficulty || gameData.difficulty === 'hard') {
      issues.push({
        type: 'info',
        category: 'Difficulty',
        message: 'Consider multiple difficulty levels',
        suggestion: 'Offer easy/normal/hard modes to accommodate different skill levels'
      });
    }

    // Check for pause functionality
    if (!gameData.mechanics?.includes('pause') && !gameData.mechanics?.includes('Pause')) {
      issues.push({
        type: 'warning',
        category: 'Controls',
        message: 'Missing pause functionality',
        suggestion: 'Add pause/resume functionality for accessibility'
      });
    }

    // Check for save/checkpoint system
    if (!gameData.mechanics?.some((m: string) => m.toLowerCase().includes('save') || m.toLowerCase().includes('checkpoint'))) {
      issues.push({
        type: 'info',
        category: 'Progress',
        message: 'No save/checkpoint system',
        suggestion: 'Consider adding save points or checkpoints for longer games'
      });
    }
  }

  private static checkColorContrast(files: Record<string, string>, issues: any[]) {
    const css = files['style.css'] || '';
    
    // Simple color contrast check (basic implementation)
    const colorRegex = /color:\s*([^;]+)/g;
    const backgroundRegex = /background(-color)?:\s*([^;]+)/g;
    
    let colorMatches = css.match(colorRegex);
    let backgroundMatches = css.match(backgroundRegex);
    
    if (colorMatches && backgroundMatches) {
      // This is a simplified check - in reality, you'd need proper color parsing
      const hasLightColors = css.includes('#fff') || css.includes('white') || css.includes('rgb(255');
      const hasDarkColors = css.includes('#000') || css.includes('black') || css.includes('rgb(0');
      
      if (!hasLightColors || !hasDarkColors) {
        issues.push({
          type: 'warning',
          category: 'Contrast',
          message: 'Potential color contrast issues',
          suggestion: 'Ensure sufficient color contrast (4.5:1 for normal text, 3:1 for large text)'
        });
      }
    }
  }

  private static checkKeyboardNavigation(gameCode: string, issues: any[]) {
    // Check for keyboard event handlers
    if (!gameCode.includes('keydown') && !gameCode.includes('keyup')) {
      issues.push({
        type: 'error',
        category: 'Keyboard',
        message: 'No keyboard input support',
        suggestion: 'Add keyboard event handlers for game controls'
      });
    }

    // Check for escape key handling
    if (!gameCode.includes('Escape') && !gameCode.includes('27')) {
      issues.push({
        type: 'info',
        category: 'Keyboard',
        message: 'No escape key handling',
        suggestion: 'Add Escape key support for pausing or exiting'
      });
    }

    // Check for Enter/Space key handling
    if (!gameCode.includes('Enter') && !gameCode.includes('Space') && !gameCode.includes('13') && !gameCode.includes('32')) {
      issues.push({
        type: 'warning',
        category: 'Keyboard',
        message: 'Limited action key support',
        suggestion: 'Add Enter and Space key support for primary actions'
      });
    }
  }

  private static calculateAccessibilityScore(issues: any[]): number {
    let score = 100;
    
    issues.forEach(issue => {
      switch (issue.type) {
        case 'error':
          score -= 15;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  private static generateRecommendations(issues: any[]): string[] {
    const recommendations = [
      'Test your game with keyboard-only navigation',
      'Use a screen reader to test game accessibility',
      'Provide clear instructions and tutorials',
      'Consider colorblind-friendly color schemes',
      'Add subtitles or visual indicators for audio cues',
      'Implement adjustable game speed settings',
      'Provide clear error messages and feedback',
      'Ensure all interactive elements are focusable'
    ];

    // Add specific recommendations based on issues
    const specificRecs = issues.map(issue => issue.suggestion);
    
    return [...new Set([...recommendations, ...specificRecs])];
  }
}