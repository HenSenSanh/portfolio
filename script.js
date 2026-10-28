document.addEventListener('DOMContentLoaded', () => {
    const colorDots = document.querySelectorAll('.color-dot');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const langToggleBtn = document.getElementById('langToggleBtn');
    const langText = document.getElementById('langText');
    const printBtn = document.getElementById('printBtn');
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    const techBadges = document.querySelectorAll('.tech-badge');
    const projectCards = document.querySelectorAll('.project-card');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const copyBtns = document.querySelectorAll('.copy-btn[data-copy]');
    const toast = document.getElementById('toast');

    // Lightbox elements
    const avatarTrigger = document.getElementById('avatarTrigger');
    const avatarModal = document.getElementById('avatarModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let currentLang = 'en';
    let activeSkill = null;
    let toastTimeout = null;

    // Hiển thị thông báo nổi (Toast)
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2400);
    }

    // 1. Khôi phục Theme & Dark Mode từ LocalStorage
    const savedTheme = localStorage.getItem('cv-theme') || 'theme-teal';
    const isDark = localStorage.getItem('cv-dark-mode') === 'true';

    document.body.className = savedTheme + (isDark ? ' dark-mode' : '');
    colorDots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === savedTheme);
    });
    updateDarkBtnUI(isDark);

    // 2. Đổi bảng màu Preset
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const selectedTheme = dot.dataset.theme;
            const darkActive = document.body.classList.contains('dark-mode');
            document.body.className = selectedTheme + (darkActive ? ' dark-mode' : '');
            localStorage.setItem('cv-theme', selectedTheme);

            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    // 3. Chuyển đổi Dark Mode / Light Mode
    function updateDarkBtnUI(darkActive) {
        const icon = darkModeBtn.querySelector('i');
        const label = darkModeBtn.querySelector('span');
        if (darkActive) {
            icon.className = 'fa-solid fa-sun';
            label.setAttribute('data-en', 'Light');
            label.setAttribute('data-vi', 'Sáng');
            label.textContent = currentLang === 'en' ? 'Light' : 'Sáng';
        } else {
            icon.className = 'fa-solid fa-moon';
            label.setAttribute('data-en', 'Dark');
            label.setAttribute('data-vi', 'Tối');
            label.textContent = currentLang === 'en' ? 'Dark' : 'Tối';
        }
    }

    darkModeBtn.addEventListener('click', () => {
        const isDarkNow = document.body.classList.toggle('dark-mode');
        localStorage.setItem('cv-dark-mode', isDarkNow);
        updateDarkBtnUI(isDarkNow);
    });

    // 4. Chuyển đổi ngôn ngữ (EN <-> VI)
    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'vi' : 'en';
        langText.textContent = currentLang.toUpperCase();

        translatableElements.forEach(el => {
            el.textContent = el.getAttribute(`data-${currentLang}`);
        });

        showToast(
            currentLang === 'vi'
                ? 'Đã chuyển tiêu đề sang Tiếng Việt'
                : 'Switched section titles to English'
        );
    });

    // 5. Tương tác Lọc Kỹ năng -> Làm nổi bật Dự án
    function clearSkillFilter() {
        activeSkill = null;
        techBadges.forEach(b => b.classList.remove('active-filter'));
        projectCards.forEach(card => {
            card.classList.remove('highlighted', 'dimmed');
        });
        resetFilterBtn.classList.add('hidden');
    }

    techBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const skill = badge.dataset.skill;

            if (activeSkill === skill) {
                clearSkillFilter();
                return;
            }

            activeSkill = skill;
            techBadges.forEach(b => b.classList.toggle('active-filter', b === badge));
            resetFilterBtn.classList.remove('hidden');

            let matchCount = 0;
            projectCards.forEach(card => {
                const tags = card.dataset.tags.split(',');
                if (tags.includes(skill)) {
                    card.classList.add('highlighted');
                    card.classList.remove('dimmed');
                    matchCount++;
                } else {
                    card.classList.remove('highlighted');
                    card.classList.add('dimmed');
                }
            });

            showToast(
                currentLang === 'vi'
                    ? `Đang lọc ${matchCount} dự án sử dụng ${badge.textContent}`
                    : `Highlighting ${matchCount} project(s) using ${badge.textContent}`
            );
        });
    });

    resetFilterBtn.addEventListener('click', clearSkillFilter);

    // 6. Sao chép nhanh SĐT & Email vào Clipboard
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(
                    currentLang === 'vi'
                        ? `Đã sao chép: ${textToCopy}`
                        : `Copied to clipboard: ${textToCopy}`
                );
            });
        });
    });

    // 7. Phóng to ảnh đại diện (Lightbox Modal)
    avatarTrigger.addEventListener('click', () => {
        avatarModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        avatarModal.classList.remove('open');
    });

    avatarModal.addEventListener('click', (e) => {
        if (e.target === avatarModal) {
            avatarModal.classList.remove('open');
        }
    });

    // 8. Xuất / In file PDF chuẩn khổ A4
    printBtn.addEventListener('click', () => {
        clearSkillFilter();
        window.print();
    });
});