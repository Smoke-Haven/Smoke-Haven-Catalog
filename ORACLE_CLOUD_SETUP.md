# Oracle Cloud Deployment Guide

## Prerequisites (You do this)
1. Create Oracle Cloud account at https://www.oracle.com/cloud/free/
2. Create a VM Instance (Ubuntu 22.04 LTS recommended)
3. Get your VM's public IP address
4. Open ports: 3000 (backend), 22 (SSH)

## SSH Into Your VM (You do this)
```bash
ssh -i your-private-key.key ubuntu@YOUR_ORACLE_VM_IP
```

## Server Setup (Run these commands on Oracle VM)

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js & npm
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 3. Install pnpm
```bash
npm install -g pnpm
pnpm -v
```

### 4. Install Git
```bash
sudo apt install -y git
```

### 5. Clone Your Repository
```bash
cd /home/ubuntu
git clone https://github.com/Smoke-Haven/Smoke-Haven-Catalog.git
cd Smoke-Haven-Catalog
```

### 6. Install Dependencies
```bash
cd artifacts/api-server
pnpm install
```

### 7. Create .env File
```bash
nano /home/ubuntu/Smoke-Haven-Catalog/artifacts/api-server/.env
```

**Paste this content:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://bhensdum15_db_user:Q1w2e3r4t5@cluster0.h5kczyf.mongodb.net/vapedb?retryWrites=true&w=majority
ADMIN_PASSWORD=admin1234
PORT=3000
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### 8. Build the Project
```bash
pnpm run build
```

### 9. Start the Server
```bash
pnpm run start
```

**Test it:**
```bash
curl http://localhost:3000/api/healthz
```

Should return: `{"status":"ok"}`

## Keep Server Running (PM2 - Background Process)

### Install PM2
```bash
sudo npm install -g pm2
```

### Start with PM2
```bash
cd /home/ubuntu/Smoke-Haven-Catalog/artifacts/api-server
pm2 start "pnpm run start" --name "vape-api"
```

### Make PM2 Start on Boot
```bash
pm2 startup
pm2 save
```

### Monitor
```bash
pm2 logs vape-api
pm2 status
```

## Get Your Oracle Server URL
Once running, your backend will be at:
```
http://YOUR_ORACLE_VM_IP:3000
```

Example: `http://203.0.113.42:3000/api/menu/items`

## Update Frontend Config (You do this)

1. Go to Netlify settings
2. Update environment variable:
   ```
   VITE_API_URL=http://YOUR_ORACLE_VM_IP:3000
   ```
3. Trigger a redeploy
4. Test at your Netlify URL

## Troubleshooting

### Can't connect to server?
- Check security rules: Allow ingress on port 3000
- Check if server is running: `pm2 status`
- Test from your machine: `curl http://YOUR_IP:3000/api/healthz`

### MongoDB connection error?
- Check `.env` file has correct credentials
- Verify MongoDB Atlas allows connections from Oracle IP
- Log check: `pm2 logs vape-api`

### Need to redeploy code?
```bash
cd /home/ubuntu/Smoke-Haven-Catalog
git pull
cd artifacts/api-server
pnpm install
pnpm run build
pm2 restart vape-api
```

## Monitoring/Logs
```bash
pm2 logs vape-api --tail 100
pm2 monit
```

## Support
If anything fails, take a screenshot and I can help!
Current database backup: `db-backup-20260329-112815.json` in git
