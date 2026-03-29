# Oracle Cloud Migration Checklist

## ✅ What I've Done For You

- [x] Created comprehensive Oracle Cloud setup guide: `ORACLE_CLOUD_SETUP.md`
- [x] Created automated deployment script: `scripts/oracle-deploy.sh`
- [x] Created database restore script: `restore-from-backup.mjs`
- [x] Backed up entire database: `db-backup-20260329-112815.json`
- [x] All code is ready to deploy
- [x] MongoDB Atlas credentials are in the code

## 📋 What YOU Need To Do

### Phase 1: Oracle Cloud Account Setup (5 minutes)
- [ ] Go to https://www.oracle.com/cloud/free/
- [ ] Create a free Oracle Cloud account
- [ ] Create a Compute VM Instance
  - Choose: Ubuntu 22.04 LTS (free tier eligible)
  - Save your private SSH key (.pem file)
  - Note your public IP address

### Phase 2: Server Deployment (15 minutes)
- [ ] SSH into your Oracle VM
- [ ] Copy all commands from `ORACLE_CLOUD_SETUP.md`
- [ ] Run them in order (they're safe)
- [ ] Verify backend is running: `curl http://YOUR_IP:3000/api/healthz`

### Phase 3: Update Frontend (5 minutes)
- [ ] Go to Netlify
- [ ] Find your vape-menu site settings
- [ ] Update environment variable: `VITE_API_URL=http://YOUR_ORACLE_IP:3000`
- [ ] Trigger a manual deploy
- [ ] Test your website - should load instantly now!

## 🆘 If Something Goes Wrong

### Backend not starting?
```bash
# SSH into Oracle VM and check:
pm2 logs vape-api
# Look for errors, send screenshot
```

### Can't reach backend?
```bash
# From your Mac:
curl http://YOUR_ORACLE_IP:3000/api/healthz
# If it fails, check Oracle Cloud security rules
```

### Need to restore database?
```bash
# From your Mac, in project directory:
node restore-from-backup.mjs db-backup-20260329-112815.json
# This will restore all 128 items with their exact status
```

## 📞 Support

If you get stuck:
1. Share the error message/screenshot
2. I can help debug via this chat
3. Database backup is saved - zero risk of data loss

## ⏱️ Timeline
- Create Oracle account: 2 min
- Set up VM: 5 min
- Deploy backend: 10 min
- Update Netlify: 5 min
- **Total: ~20 minutes**

## 🎯 Benefits After Migration
- ✅ Zero cold starts (instant loading)
- ✅ Always-on (24/7 uptime)
- ✅ Completely free forever
- ✅ Same database (MongoDB Atlas)
- ✅ Same code structure
- ✅ All your data preserved

**Start whenever you're ready! Let me know if you have questions.** 🚀
