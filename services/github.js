const https = require('https');

class GitHubService {
  static async fetchUserRepos(username) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        method: 'GET',
        headers: {
          'User-Agent': 'Portfolio-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const repos = JSON.parse(data);
              const parsed = repos.map(repo => ({
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description || 'No description provided',
                html_url: repo.html_url,
                homepage: repo.homepage || '',
                language: repo.language || 'Unknown',
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                topics: repo.topics || [],
                updated_at: repo.updated_at,
                fork: repo.fork
              }));
              resolve(parsed.filter(r => !r.fork));
            } catch (e) {
              reject(new Error('Failed to parse GitHub response'));
            }
          } else if (res.statusCode === 404) {
            reject(new Error(`GitHub user "${username}" not found`));
          } else if (res.statusCode === 403) {
            reject(new Error('GitHub API rate limit exceeded. Please try again later.'));
          } else {
            reject(new Error(`GitHub API error: ${res.statusCode}`));
          }
        });
      });

      req.on('error', (e) => reject(new Error('Failed to connect to GitHub API')));
      req.end();
    });
  }
}

module.exports = GitHubService;
