module.exports = {
    env: {
        es6: true,
        node: true,
        mocha: true,
    },
    extends: 'eslint:recommended',
    rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    },
};
