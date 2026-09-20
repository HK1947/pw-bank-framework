import { Page, Locator } from '@playwright/test';

interface LocatorOptions {
    testId?: string;
    role?: { type: 'button' | 'link' | 'textbox' | 'checkbox'; name: string };
    label?: string;
    text?: string;
    css?: string;
}

export function smartLocator(page: Page, options: LocatorOptions): Locator {
    const strategies: Locator[] = [];

    // Priority 1: testId (most stable)
    if (options.testId) {
        strategies.push(page.getByTestId(options.testId));
    }

    // Priority 2: role (semantic, survives CSS changes)
    if (options.role) {
        strategies.push(page.getByRole(options.role.type, { name: options.role.name }));
    }

    // Priority 3: label (good for form inputs)
    if (options.label) {
        strategies.push(page.getByLabel(options.label));
    }

    // Priority 4: visible text
    if (options.text) {
        strategies.push(page.getByText(options.text));
    }

    // Priority 5: CSS (last resort — breaks easily)
    if (options.css) {
        strategies.push(page.locator(options.css));
    }

    if (strategies.length === 0) {
        throw new Error('smartLocator needs at least one strategy');
    }

    // Chain all strategies with .or()
    let result = strategies[0];
    for (let i = 1; i < strategies.length; i++) {
        result = result.or(strategies[i]);
    }

    return result;
}