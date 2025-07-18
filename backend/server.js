require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Types } = require('mongoose');


const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String }, // demo 用戶可沒有密碼
    role: { type: String, enum: ['user', 'demo', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

//MindMap Schema
const TaskHistorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    user: { type: String, required: true },
    action: { type: String, required: true },
    previousStatus: { type: String },
    currentStatus: { type: String },
    previousProgress: { type: Number },
    currentProgress: { type: Number },
    note: { type: String },
});

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String},
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], required: true },
    progress: { type: Number, required: true },
    assignedTo: { type: String, default: null },
    deadline: { type: Date, default: null },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    history: { type: [TaskHistorySchema], default: [] },
});

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, enum: ['default', 'input', 'output', 'custom'], required: true },
    data: {
        label: { type: String, required: true },
        task: { type: TaskSchema, default: null },
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    // style: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String, default: null },
    animated: { type: Boolean, default: false },
    label: { type: String, default: null },
    // style: { type: mongoose.Sxchema.Types.Mixed, default: {} },
});

const MindMapSchema = new mongoose.Schema({
    id: { type: String},
    title: { type: String, required: true },
    description: { type: String, default: '' },
    nodes: { type: [NodeSchema], default: [] },
    edges: { type: [EdgeSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    collaborators: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            role: { type: String, enum: ['viewer', 'editor', 'owner'], required: true }
        }
    ],
});

const MindMap = mongoose.model('MindMap', MindMapSchema);

// JWT 驗證
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Missing token' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

//POST  Signin
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '請填入帳號和密碼' });
    }

    if (username === 'demo@domain.com') {
        let demoUser = await User.findOne({ username: username });
        const token = jwt.sign({ id: demoUser._id, username: demoUser.username, role: demoUser.role }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: '帳號或密碼錯誤' });
        }

        const passwordMatch = bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ message: '帳號或密碼錯誤' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
});

//POST SignUp 
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '請填入帳號和密碼' });
    }

    try {
        //檢查帳號是否存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '帳號已存在' });
        }

        //加密
        const passwordHash = await bcrypt.hash(password, 10);

        //建立使用者
        const newUser = new User({
            username,
            passwordHash,
            role: 'user', // 預設角色為 user
        })
        await newUser.save();

        //產生JWT
        const token = jwt.sign(
            { id: newUser._id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        res.status(201).json({ token });
    } catch (error) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }

})

//GET Mindmap List
app.get('/mindmaps', authenticateToken, async (req, res) => {
    try {
        const userObjectId = Types.ObjectId.createFromHexString(req.user.id);
        const role = req.user.role;

        if (role === 'demo') {
            const demoMaps = await MindMap.find({
                $or: [
                    { createdBy: userObjectId },
                    { collaborators: userObjectId },
                ]
            }).populate('createdBy');
            return res.json(demoMaps);
        }

        const maps = await MindMap.find({
            $or: [
                { createdBy: userObjectId },
                { collaborators: userObjectId },
            ]
        }).populate('createdBy');
        res.json(maps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/mindmaps', authenticateToken, async (req, res) => {
    if (req.user.role === 'demo') {
        return res.status(403).json({ error: 'Demo user 無新增權限' });
    }

    try {
        const data = req.body;
        data.createdBy = Types.ObjectId.createFromHexString(req.user.id);
        const mindmap = new MindMap(data);
        try {
            await mindmap.save();
        } catch (saveErr) {
            return res.status(400).json({ error: saveErr.message });
        }
        res.status(201).json(mindmap);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/mindmaps/:id', authenticateToken, async (req, res) => {
    if (req.user.role === 'demo') {
        return res.status(403).json({ error: 'Demo user 無修改權限' });
    }

    try {
        const mindmapId = req.params.id;
        const updates = req.body;

        const mindmap = await MindMap.findOne({ _id: mindmapId, createdBy: Types.ObjectId.createFromHexString(req.user.id) });
        if (!mindmap) {
            return res.status(404).json({ error: 'Mind map not found' });
        }
        mindmap.updatedAt = new Date();
        Object.assign(mindmap, updates);
        await mindmap.save();

        res.json(mindmap);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 啟動
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});