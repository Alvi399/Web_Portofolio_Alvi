module.exports = {
  apps: [{
    name: "alvi-portfolio",
    script: "./app.js",
    instances: "max", // Utilize all CPU cores
    exec_mode: "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
