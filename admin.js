import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc,
    doc, onSnapshot, serverTimestamp, orderBy, query 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAsaM1XDG9gcYg79S8CSl83OCuqqloIzB0",
  authDomain: "apex-building-67412.firebaseapp.com",
  projectId: "apex-building-67412",
  storageBucket: "apex-building-67412.firebasestorage.app",
  messagingSenderId: "387820864534",
  appId: "1:387820864534:web:f82c133862f69c1aee6137",
  measurementId: "G-81B31CF4XS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ImgBB API Key - Replace with your own from https://api.imgbb.com/
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

// Elements
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.content-section');
const sectionTitle = document.getElementById('sectionTitle');
const adminEmailEl = document.getElementById('adminEmail');

const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');

// Stats elements
const ongoingCount = document.getElementById('ongoingCount');
const completedCount = document.getElementById('completedCount');
const blogsCount = document.getElementById('blogsCount');
const queriesCount = document.getElementById('queriesCount');

// Tables
const ongoingTableBody = document.querySelector('#ongoingProjectsTable tbody');
const completedTableBody = document.querySelector('#completedProjectsTable tbody');
const blogsTableBody = document.querySelector('#blogsTable tbody');
const queriesTableBody = document.querySelector('#queriesTable tbody');

// Project modal elements
const projectModal = document.getElementById('projectModal');
const projectForm = document.getElementById('projectForm');
const projectTypeInput = document.getElementById('projectType');
const projectIdInput = document.getElementById('projectId');
const projectModalTitle = document.getElementById('projectModalTitle');

// Blog modal elements
const blogModal = document.getElementById('blogModal');
const blogForm = document.getElementById('blogForm');
const blogIdInput = document.getElementById('blogId');
const blogModalTitle = document.getElementById('blogModalTitle');

// Nav switching
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        if (!sectionId) return;

        navItems.forEach(n => n.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        item.classList.add('active');
        document.getElementById(sectionId).classList.add('active');
        sectionTitle.textContent = item.textContent.trim();
    });
});

// Auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginModal.classList.remove('active');
        adminEmailEl.textContent = user.email;
        initRealtimeData();
    } else {
        loginModal.classList.add('active');
        adminEmailEl.textContent = 'Admin';
    }
});

// Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            loginForm.reset();
        } catch (err) {
            alert('❌ Login failed. Please check your credentials.');
            console.error(err);
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    });
}

// ImgBB Upload Function
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error('ImgBB upload failed: ' + (data.error?.message || 'Unknown error'));
    }
    return data.data.display_url;
}

// Realtime data listeners
function initRealtimeData() {
    // Ongoing projects
    onSnapshot(collection(db, 'ongoingProjects'), (snapshot) => {
        ongoingTableBody.innerHTML = '';
        ongoingCount.textContent = snapshot.size;
        snapshot.forEach(docSnap => {
            const p = docSnap.data();
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.imageUrl || 'https://via.placeholder.com/60'}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/60'"></td>
                <td>${p.title}</td>
                <td>${p.location}</td>
                <td>${p.area || '-'}</td>
                <td><span style="color: #F59E20; font-weight: 600;">In Progress</span></td>
                <td>
                    <button class="btn-action btn-edit" data-type="ongoing" data-id="${docSnap.id}">Edit</button>
                    <button class="btn-action btn-delete" data-type="ongoing" data-id="${docSnap.id}">Delete</button>
                </td>
            `;
            ongoingTableBody.appendChild(tr);
        });
    });

    // Completed projects
    onSnapshot(collection(db, 'completedProjects'), (snapshot) => {
        completedTableBody.innerHTML = '';
        completedCount.textContent = snapshot.size;
        snapshot.forEach(docSnap => {
            const p = docSnap.data();
            const completedDate = p.completedAt && p.completedAt.toDate ? p.completedAt.toDate().toLocaleDateString() : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.imageUrl || 'https://via.placeholder.com/60'}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/60'"></td>
                <td>${p.title}</td>
                <td>${p.location}</td>
                <td>${p.area || '-'}</td>
                <td>${completedDate}</td>
                <td>
                    <button class="btn-action btn-edit" data-type="completed" data-id="${docSnap.id}">Edit</button>
                    <button class="btn-action btn-delete" data-type="completed" data-id="${docSnap.id}">Delete</button>
                </td>
            `;
            completedTableBody.appendChild(tr);
        });
    });

    // Blogs
    const blogsQuery = query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'));
    onSnapshot(blogsQuery, (snapshot) => {
        blogsTableBody.innerHTML = '';
        blogsCount.textContent = snapshot.size;
        snapshot.forEach(docSnap => {
            const b = docSnap.data();
            const date = b.publishedAt && b.publishedAt.toDate ? b.publishedAt.toDate().toLocaleDateString() : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${b.imageUrl || 'https://via.placeholder.com/60'}" alt="${b.title}" onerror="this.src='https://via.placeholder.com/60'"></td>
                <td>${b.title}</td>
                <td>${b.author || 'APEX Team'}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-action btn-edit" data-type="blog" data-id="${docSnap.id}">Edit</button>
                    <button class="btn-action btn-delete" data-type="blog" data-id="${docSnap.id}">Delete</button>
                </td>
            `;
            blogsTableBody.appendChild(tr);
        });
    });

    // Customer Queries
    const queriesQuery = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
    onSnapshot(queriesQuery, (snapshot) => {
        queriesTableBody.innerHTML = '';
        queriesCount.textContent = snapshot.size;
        snapshot.forEach(docSnap => {
            const q = docSnap.data();
            const date = q.createdAt && q.createdAt.toDate ? q.createdAt.toDate().toLocaleString() : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${q.customerName}</td>
                <td>${q.phone}</td>
                <td>${q.location}</td>
                <td>${q.serviceType || '-'}</td>
                <td>${q.description}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-action btn-delete" data-type="query" data-id="${docSnap.id}">Delete</button>
                </td>
            `;
            queriesTableBody.appendChild(tr);
        });
    });
}

/* Helper functions to open/close modals */
window.showAddProjectModal = function(type) {
    projectForm.reset();
    projectIdInput.value = '';
    projectTypeInput.value = type;
    projectModalTitle.textContent = type === 'ongoing' ? 'Add Ongoing Project' : 'Add Completed Project';
    projectModal.classList.add('active');
};

window.showAddBlogModal = function() {
    blogForm.reset();
    blogIdInput.value = '';
    blogModalTitle.textContent = 'Add Blog Post';
    blogModal.classList.add('active');
};

window.closeModal = function(id) {
    document.getElementById(id).classList.remove('active');
};

// Handle project form submit
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = projectTypeInput.value;
        const title = document.getElementById('projectTitle').value;
        const description = document.getElementById('projectDescription').value;
        const location = document.getElementById('projectLocation').value;
        const area = document.getElementById('projectArea').value;
        let imageUrl = document.getElementById('projectImage').value;
        const id = projectIdInput.value;
        const fileInput = document.getElementById('projectImageFile');

        // Upload image if file selected
        if (fileInput && fileInput.files[0]) {
            try {
                document.getElementById('uploadProgress').style.display = 'block';
                document.getElementById('uploadStatus').textContent = 'Uploading...';
                imageUrl = await uploadToImgBB(fileInput.files[0]);
                document.getElementById('uploadStatus').textContent = 'Upload successful!';
            } catch (err) {
                console.error(err);
                alert('Image upload failed: ' + err.message);
                document.getElementById('uploadProgress').style.display = 'none';
                return;
            }
        }

        const data = {
            title,
            description,
            location,
            area,
            imageUrl,
            createdAt: serverTimestamp()
        };

        if (type === 'completed') {
            data.completedAt = serverTimestamp();
        }

        try {
            const colName = type === 'ongoing' ? 'ongoingProjects' : 'completedProjects';
            if (id) {
                await updateDoc(doc(db, colName, id), data);
                alert('✅ Project updated successfully!');
            } else {
                await addDoc(collection(db, colName), data);
                alert('✅ Project added successfully!');
            }
            closeModal('projectModal');
            document.getElementById('uploadProgress').style.display = 'none';
        } catch (err) {
            console.error(err);
            alert('Error saving project: ' + err.message);
        }
    });
}

// Handle blog form submit
if (blogForm) {
    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('blogTitle').value;
        const author = document.getElementById('blogAuthor').value;
        const excerpt = document.getElementById('blogExcerpt').value;
        const content = document.getElementById('blogContent').value;
        let imageUrl = document.getElementById('blogImage').value;
        const id = blogIdInput.value;
        const fileInput = document.getElementById('blogImageFile');

        // Upload image if file selected
        if (fileInput && fileInput.files[0]) {
            try {
                document.getElementById('blogUploadProgress').style.display = 'block';
                document.getElementById('blogUploadStatus').textContent = 'Uploading...';
                imageUrl = await uploadToImgBB(fileInput.files[0]);
                document.getElementById('blogUploadStatus').textContent = 'Upload successful!';
            } catch (err) {
                console.error(err);
                alert('Image upload failed: ' + err.message);
                document.getElementById('blogUploadProgress').style.display = 'none';
                return;
            }
        }

        const data = {
            title,
            author,
            excerpt,
            content,
            imageUrl,
            publishedAt: serverTimestamp()
        };

        try {
            if (id) {
                await updateDoc(doc(db, 'blogs', id), data);
                alert('✅ Blog post updated successfully!');
            } else {
                await addDoc(collection(db, 'blogs'), data);
                alert('✅ Blog post published successfully!');
            }
            closeModal('blogModal');
            document.getElementById('blogUploadProgress').style.display = 'none';
        } catch (err) {
            console.error(err);
            alert('Error saving blog post: ' + err.message);
        }
    });
}

// Handle edit/delete actions via event delegation
document.addEventListener('click', async (e) => {
    const editBtn = e.target.closest('.btn-edit');
    const deleteBtn = e.target.closest('.btn-delete');

    if (editBtn) {
        const type = editBtn.getAttribute('data-type');
        const id = editBtn.getAttribute('data-id');

        if (type === 'ongoing' || type === 'completed') {
            const colName = type === 'ongoing' ? 'ongoingProjects' : 'completedProjects';
            const snap = await getDocs(collection(db, colName));
            let selected;
            snap.forEach(d => { if (d.id === id) selected = d.data(); });
            if (!selected) return;

            projectTypeInput.value = type;
            projectIdInput.value = id;
            projectModalTitle.textContent = 'Edit Project';

            document.getElementById('projectTitle').value = selected.title || '';
            document.getElementById('projectDescription').value = selected.description || '';
            document.getElementById('projectLocation').value = selected.location || '';
            document.getElementById('projectArea').value = selected.area || '';
            document.getElementById('projectImage').value = selected.imageUrl || '';
            projectModal.classList.add('active');
        }

        if (type === 'blog') {
            const snap = await getDocs(collection(db, 'blogs'));
            let selected;
            snap.forEach(d => { if (d.id === id) selected = d.data(); });
            if (!selected) return;

            blogIdInput.value = id;
            blogModalTitle.textContent = 'Edit Blog Post';
            document.getElementById('blogTitle').value = selected.title || '';
            document.getElementById('blogAuthor').value = selected.author || '';
            document.getElementById('blogExcerpt').value = selected.excerpt || '';
            document.getElementById('blogContent').value = selected.content || '';
            document.getElementById('blogImage').value = selected.imageUrl || '';
            blogModal.classList.add('active');
        }
    }

    if (deleteBtn) {
        const type = deleteBtn.getAttribute('data-type');
        const id = deleteBtn.getAttribute('data-id');
        if (!confirm('⚠️ Are you sure you want to delete this item? This action cannot be undone.')) return;

        try {
            if (type === 'ongoing' || type === 'completed' || type === 'blog' || type === 'query') {
                const colName = type === 'ongoing' ? 'ongoingProjects'
                             : type === 'completed' ? 'completedProjects'
                             : type === 'blog' ? 'blogs'
                             : 'queries';
                await deleteDoc(doc(db, colName, id));
                alert('✅ Item deleted successfully!');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting item: ' + err.message);
        }
    }
});

// Estimate Requests
const estimatesQuery = query(collection(db, 'estimates'), orderBy('createdAt', 'desc'));
onSnapshot(estimatesQuery, (snapshot) => {
    const estimatesTableBody = document.querySelector('#estimatesTable tbody');
    const estimatesCount = document.getElementById('estimatesCount');
    const pendingEstimates = document.getElementById('pendingEstimates');
    
    if (estimatesTableBody) estimatesTableBody.innerHTML = '';
    if (estimatesCount) estimatesCount.textContent = snapshot.size;
    if (pendingEstimates) pendingEstimates.textContent = `${snapshot.size} Pending`;
    
    snapshot.forEach(docSnap => {
        const est = docSnap.data();
        const date = est.createdAt && est.createdAt.toDate 
            ? est.createdAt.toDate().toLocaleString() 
            : '-';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${est.customerName}</strong></td>
            <td>${est.phone}<br><small style="color:#666;">${est.email}</small></td>
            <td>${est.location}</td>
            <td><span style="background:#e3f2fd; padding:4px 8px; border-radius:4px; font-size:0.85rem;">${est.projectType}</span></td>
            <td>${est.area}</td>
            <td>${est.budget || '-'}</td>
            <td>${est.startDate || '-'}</td>
            <td>
                <span class="loan-badge ${est.loanAssistance ? 'yes' : 'no'}">
                    ${est.loanAssistance ? 'Yes' : 'No'}
                </span>
            </td>
            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis;">${est.description}</td>
            <td><small>${date}</small></td>
            <td>
                <button class="btn-action btn-delete" data-type="estimate" data-id="${docSnap.id}">Delete</button>
            </td>
        `;
        if (estimatesTableBody) estimatesTableBody.appendChild(tr);
    });
});
