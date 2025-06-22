// Get DOM elements
const searchInput = document.getElementById('searchInput');
const addBookmarkBtn = document.getElementById('addBookmarkBtn');
const bookmarkSections = document.querySelectorAll('.bookmark-section');

// Search functionality
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Iterate through all bookmark items
    document.querySelectorAll('.bookmark-item').forEach(item => {
        const title = item.querySelector('span').textContent.toLowerCase();
        const section = item.closest('.bookmark-section');
        
        if (title.includes(searchTerm)) {
            item.style.display = 'flex';
            section.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Hide empty sections
    bookmarkSections.forEach(section => {
        const visibleItems = section.querySelectorAll('.bookmark-item[style="display: flex"]');
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        }
    });
});

// Create modal function
function createModal(title, formContent) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            ${formContent}
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Add bookmark functionality
addBookmarkBtn.addEventListener('click', function() {
    const formContent = `
        <form id="addBookmarkForm">
            <div class="form-group">
                <label for="bookmarkTitle">Website Name</label>
                <input type="text" id="bookmarkTitle" required>
            </div>
            <div class="form-group">
                <label for="bookmarkUrl">Website URL</label>
                <input type="url" id="bookmarkUrl" required>
            </div>
            <div class="form-group">
                <label for="bookmarkCategory">Category</label>
                <select id="bookmarkCategory" required>
                    <option value="Frequently Used">Frequently Used</option>
                    <option value="Learning Resources">Learning Resources</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Tools">Tools</option>
                </select>
            </div>
            <div class="form-buttons">
                <button type="submit">Add</button>
                <button type="button" class="cancel-btn">Cancel</button>
            </div>
        </form>
    `;
    
    const modal = createModal('Add New Bookmark', formContent);
    
    // Handle form submission
    const form = document.getElementById('addBookmarkForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('bookmarkTitle').value;
        const url = document.getElementById('bookmarkUrl').value;
        const category = document.getElementById('bookmarkCategory').value;
        
        // Create new bookmark
        const newBookmark = document.createElement('a');
        newBookmark.href = url;
        newBookmark.className = 'bookmark-item';
        newBookmark.target = '_blank';
        newBookmark.innerHTML = `
            <div class="bookmark-actions">
                <button class="action-btn edit-btn" title="Edit"><i class="ri-edit-line"></i></button>
                <button class="action-btn delete-btn" title="Delete"><i class="ri-delete-bin-line"></i></button>
            </div>
            <i class="ri-link"></i>
            <span>${title}</span>
        `;
        
        // Add to corresponding section
        const targetSection = Array.from(bookmarkSections).find(section => 
            section.querySelector('.section-title').textContent.trim() === category
        );
        
        if (targetSection) {
            targetSection.querySelector('.bookmark-grid').appendChild(newBookmark);
            // Add animation
            newBookmark.style.animation = 'fadeIn 0.5s ease-out';
        }
        
        // Close modal
        modal.remove();
    });
    
    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function() {
        modal.remove();
    });
});

// Edit bookmark functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-btn')) {
        const bookmarkItem = e.target.closest('.bookmark-item');
        const title = bookmarkItem.querySelector('span').textContent;
        const url = bookmarkItem.href;
        const category = bookmarkItem.closest('.bookmark-section')
            .querySelector('.section-title').textContent.trim();
        
        const formContent = `
            <form id="editBookmarkForm">
                <div class="form-group">
                    <label for="bookmarkTitle">Website Name</label>
                    <input type="text" id="bookmarkTitle" value="${title}" required>
                </div>
                <div class="form-group">
                    <label for="bookmarkUrl">Website URL</label>
                    <input type="url" id="bookmarkUrl" value="${url}" required>
                </div>
                <div class="form-group">
                    <label for="bookmarkCategory">Category</label>
                    <select id="bookmarkCategory" required>
                        <option value="Frequently Used" ${category === 'Frequently Used' ? 'selected' : ''}>Frequently Used</option>
                        <option value="Learning Resources" ${category === 'Learning Resources' ? 'selected' : ''}>Learning Resources</option>
                        <option value="Entertainment" ${category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                        <option value="Tools" ${category === 'Tools' ? 'selected' : ''}>Tools</option>
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="submit">Save</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `;
        
        const modal = createModal('Edit Bookmark', formContent);
        
        // Handle form submission
        const form = document.getElementById('editBookmarkForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newTitle = document.getElementById('bookmarkTitle').value;
            const newUrl = document.getElementById('bookmarkUrl').value;
            const newCategory = document.getElementById('bookmarkCategory').value;
            
            // Update bookmark
            bookmarkItem.href = newUrl;
            bookmarkItem.querySelector('span').textContent = newTitle;
            
            // If category changed, move to new category
            if (newCategory !== category) {
                const targetSection = Array.from(bookmarkSections).find(section => 
                    section.querySelector('.section-title').textContent.trim() === newCategory
                );
                
                if (targetSection) {
                    targetSection.querySelector('.bookmark-grid').appendChild(bookmarkItem);
                    // Add animation
                    bookmarkItem.style.animation = 'fadeIn 0.5s ease-out';
                }
            }
            
            // Close modal
            modal.remove();
        });
        
        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }
});

// Delete bookmark functionality
document.addEventListener('click', function(e) {
    if (e.target.closest('.delete-btn')) {
        const bookmarkItem = e.target.closest('.bookmark-item');
        const title = bookmarkItem.querySelector('span').textContent;
        
        const formContent = `
            <div class="delete-confirmation">
                <p>Are you sure you want to delete "${title}"?</p>
                <div class="form-buttons">
                    <button class="confirm-delete-btn">Delete</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;
        
        const modal = createModal('Delete Bookmark', formContent);
        
        // Handle confirm delete
        const confirmBtn = modal.querySelector('.confirm-delete-btn');
        confirmBtn.addEventListener('click', function() {
            // Add delete animation
            bookmarkItem.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => {
                bookmarkItem.remove();
                modal.remove();
            }, 300);
        });
        
        // Handle cancel button
        const cancelBtn = modal.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
    }
});

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    bookmarkSections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add delete animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
}); 