// 读取本地数据
function getRecords() {
    return JSON.parse(localStorage.getItem("diaryRecords")) || [];
}

// 保存数据
function saveRecords(records) {
    localStorage.setItem("diaryRecords", JSON.stringify(records));
}

// 示例：第一次使用时初始化数据
if (getRecords().length === 0) {
    saveRecords([
        {
            type: "travel",
            date: "2026-02-05",
            text: "第一次用自己做的网站记录旅行，很安静的一天。",
        },
        {
            type: "life",
            date: "2026-02-06",
            text: "下午喝了一杯咖啡，什么都没发生。",
        },
        {
            type: "mood",
            date: "2026-02-07",
            text: "🙂 平静",
        }
    ]);
}

// 首页显示最近三条
const container = document.getElementById("latest-records");
if (container) {
    const records = getRecords().slice(-3).reverse();

    records.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="date">${item.date}</div>
            <div class="text">${item.text}</div>
        `;

        container.appendChild(card);
    });
}

// ========== 旅游相册逻辑 ==========
const addBtn = document.getElementById("addTravelBtn");
const form = document.getElementById("travelForm");
const saveBtn = document.getElementById("saveTravel");
const list = document.getElementById("travelList");

// 显示 / 隐藏表单
if (addBtn) {
    addBtn.onclick = () => {
        form.classList.toggle("hidden");
    };
}

// 读取已有数据
function getTravelRecords() {
    return JSON.parse(localStorage.getItem("travelRecords")) || [];
}

function saveTravelRecords(data) {
    localStorage.setItem("travelRecords", JSON.stringify(data));
}

// 保存新记录
if (saveBtn) {
    saveBtn.onclick = () => {
        const date = document.getElementById("travelDate").value;
        const place = document.getElementById("travelPlace").value;
        const text = document.getElementById("travelText").value;
        const imageInput = document.getElementById("travelImage");

        if (!date || !place || !imageInput.files[0]) {
            alert("请填写日期、地点并选择图片");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const records = getTravelRecords();
            records.push({
                date,
                place,
                text,
                image: reader.result
            });
            saveTravelRecords(records);
            renderTravel();
            form.classList.add("hidden");
        };

        reader.readAsDataURL(imageInput.files[0]);
    };
}

// 渲染相册
function renderTravel() {
    if (!list) return;

    list.innerHTML = "";
    const records = getTravelRecords().reverse();

    records.forEach(item => {
        const card = document.createElement("div");
        card.className = "card photo-card";

        card.innerHTML = `
            <img src="${item.image}">
            <div class="date">${item.date}</div>
            <div class="place">${item.place}</div>
            <div class="text">${item.text || ""}</div>
        `;

        list.appendChild(card);
    });
}

renderTravel();

// ========== 每日心情逻辑 ==========
const moodTags = document.querySelectorAll(".mood-tags span");
const moodText = document.getElementById("moodText");
const saveMoodBtn = document.getElementById("saveMood");
const moodList = document.getElementById("moodList");

let selectedMood = "";

// 选择情绪
moodTags.forEach(tag => {
    tag.onclick = () => {
        moodTags.forEach(t => t.classList.remove("active"));
        tag.classList.add("active");
        selectedMood = tag.dataset.mood;
    };
});

// 读取心情
function getMoods() {
    return JSON.parse(localStorage.getItem("moodRecords")) || [];
}

function saveMoods(data) {
    localStorage.setItem("moodRecords", JSON.stringify(data));
}

// 保存今日心情
if (saveMoodBtn) {
    saveMoodBtn.onclick = () => {
        if (!selectedMood) {
            alert("请选择一个情绪");
            return;
        }

        const text = moodText.value;
        const today = new Date().toISOString().slice(0, 10);

        let moods = getMoods();

        // 同一天只保留一条
        moods = moods.filter(item => item.date !== today);

        moods.push({
            date: today,
            mood: selectedMood,
            text
        });

        saveMoods(moods);
        moodText.value = "";
        selectedMood = "";
        moodTags.forEach(t => t.classList.remove("active"));
        renderMoods();
    };
}

// 渲染心情列表
function renderMoods() {
    if (!moodList) return;

    moodList.innerHTML = "";
    const moods = getMoods().reverse();

    moods.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="date">${item.date}</div>
            <div class="text">${item.mood}</div>
            <div class="text">${item.text || ""}</div>
        `;

        moodList.appendChild(card);
    });
}

renderMoods();

// ========== 生活趣事逻辑 ==========
const addLifeBtn = document.getElementById("addLifeBtn");
const lifeForm = document.getElementById("lifeForm");
const saveLifeBtn = document.getElementById("saveLife");
const lifeList = document.getElementById("lifeList");

// 展开 / 收起表单
if (addLifeBtn) {
    addLifeBtn.onclick = () => {
        lifeForm.classList.toggle("hidden");
    };
}

// 读取 & 保存
function getLifeRecords() {
    return JSON.parse(localStorage.getItem("lifeRecords")) || [];
}

function saveLifeRecords(data) {
    localStorage.setItem("lifeRecords", JSON.stringify(data));
}

// 保存记录
if (saveLifeBtn) {
    saveLifeBtn.onclick = () => {
        const text = document.getElementById("lifeText").value;
        const imageInput = document.getElementById("lifeImage");

        if (!text.trim()) {
            alert("至少写点什么吧");
            return;
        }

        const date = new Date().toISOString().slice(0, 10);

        const saveRecord = (imageData = "") => {
            const records = getLifeRecords();
            records.push({
                date,
                text,
                image: imageData
            });
            saveLifeRecords(records);
            lifeForm.classList.add("hidden");
            document.getElementById("lifeText").value = "";
            imageInput.value = "";
            renderLife();
        };

        // 有图 / 无图两种情况
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = () => saveRecord(reader.result);
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            saveRecord();
        }
    };
}

// 渲染列表
function renderLife() {
    if (!lifeList) return;

    lifeList.innerHTML = "";
    const records = getLifeRecords().reverse();

    records.forEach(item => {
        const card = document.createElement("div");
        card.className = "card life-card";

        card.innerHTML = `
            <div class="date">${item.date}</div>
            <div class="text">${item.text}</div>
            ${item.image ? `<img src="${item.image}">` : ""}
        `;

        lifeList.appendChild(card);
    });
}

renderLife();

// ========== 归档页逻辑 ==========
const archiveList = document.getElementById("archiveList");

function renderArchive() {
    if (!archiveList) return;

    let all = [];

    // 旅行
    const travels = JSON.parse(localStorage.getItem("travelRecords")) || [];
    travels.forEach(item => {
        all.push({
            date: item.date,
            type: "旅行",
            text: item.place + " · " + (item.text || ""),
            image: item.image || ""
        });
    });

    // 生活
    const lifes = JSON.parse(localStorage.getItem("lifeRecords")) || [];
    lifes.forEach(item => {
        all.push({
            date: item.date,
            type: "生活",
            text: item.text,
            image: item.image || ""
        });
    });

    // 心情
    const moods = JSON.parse(localStorage.getItem("moodRecords")) || [];
    moods.forEach(item => {
        all.push({
            date: item.date,
            type: "心情",
            text: item.mood + " " + (item.text || ""),
            image: ""
        });
    });

    // 按时间排序（新 → 旧）
    all.sort((a, b) => b.date.localeCompare(a.date));

    archiveList.innerHTML = "";

    all.forEach(item => {
        const block = document.createElement("div");
        block.className = "timeline-item";

        block.innerHTML = `
            <div class="timeline-card">
                <div class="date">${item.date}</div>
                <div class="type">${item.type}</div>
                <div class="text">${item.text}</div>
                ${item.image ? `<img src="${item.image}">` : ""}
            </div>
        `;

        archiveList.appendChild(block);
    });
}

renderArchive();
