import {
    isMatch as _isMatch,
    matcher as _matcher,
    type Options,
} from 'matcher';

export function isMatch(str: string, rules: string | string[]) {
    return _isMatch(str, rules);
}

export function matcher(
    str: string,
    rules: string | string[],
    options?: Options
) {
    return _matcher(str, rules, options);
}

export function getMatchRules(str: string, rules: string[]) {
    if (matcher(str, rules).length)
        return rules
            .filter(rule => isMatch(str, rule))
            .filter(rule => !rule.startsWith('!'));

    return [];
}
