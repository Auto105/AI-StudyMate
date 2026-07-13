export function isMockApiEnabled() {
  return process.env.USE_MOCK_API !== 'false';
}
