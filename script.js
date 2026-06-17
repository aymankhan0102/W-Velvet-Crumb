document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. STANDARD FADE SLIDERS (Home & Reviews)
    // ==========================================
    // A reusable setup to keep us from repeating the same fade logic everywhere
    function setupFadeSlider(slideGroup, dotGroup, activeClass = "active", activeDotClass = "active-dot") {
        const slides = document.querySelectorAll(slideGroup);
        const dots = document.querySelectorAll(dotGroup);
        
        if (!slides.length) return; // safety check 

        let activeIndex = 0;
        let timer = null;

        function goToSlide(targetIndex) {
            // Remove active states
            slides[activeIndex].classList.remove(activeClass);
            if (dots[activeIndex]) dots[activeIndex].classList.remove(activeDotClass);
            
            // Set new active index and apply classes
            activeIndex = targetIndex;
            slides[activeIndex].classList.add(activeClass);
            if (dots[activeIndex]) dots[activeIndex].classList.add(activeDotClass);
        }

        // Handle direct dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goToSlide(index);
                resetAutoplay(); // Reset timer if user interacts manually
            });
        });

        // 5-second automatic progression
        function startAutoplay() {
            timer = setInterval(() => {
                const nextIndex = (activeIndex + 1) % slides.length;
                goToSlide(nextIndex);
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(timer);
            startAutoplay();
        }

        startAutoplay();
    }

    // Initialize standard elements
    setupFadeSlider(".slide", ".slider-dots .dot");
    setupFadeSlider(".testimonial", ".t-dot");


    // ==========================================
    // 2. PROMO HORIZONTAL CAROUSEL
    // ==========================================
    const promoContainer = document.querySelector(".promo-container");
    const promoDots = document.querySelectorAll(".promo-dots .dot");
    const promoCards = document.querySelectorAll(".promo-card");

    if (promoContainer && promoDots.length && promoCards.length) {
        promoDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                const gap = 25; // Matching the CSS grid/flex layout gap
                const slideWidth = promoCards[0].offsetWidth;
                const scrollTarget = (slideWidth + gap) * index;

                // Smooth scrolling container offset
                promoContainer.scrollTo({ 
                    left: scrollTarget, 
                    behavior: "smooth" 
                });

                // Move active dot state
                document.querySelector(".promo-dots .dot.active")?.classList.remove("active");
                dot.classList.add("active");
            });
        });
    }


    // ==========================================
    // 3. MENU SEARCH ENGINE
    // ==========================================
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.getElementById("search-box");
    const searchToggle = document.querySelector(".search-icon");
    const submitSearchBtn = document.querySelector('.search-form .fa-magnifying-glass');

    const availableItems = ["pastry", "cakes", "cookie", "bread", "cheesecake", "cupcake", "croissant", "beverages", "brownies", "sandwiches"];

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            alert("Please enter a item or flavor to search!");
            return;
        }

        const isItemAvailable = availableItems.some(item => item.includes(query));
        
        if (isItemAvailable) {
            alert(`🎉 Great news! We have "${query}" available today.`);
        } else {
            alert(`🧁 Bummer... We don't have "${query}" right now.`);
        }
    }

    // Toggle search bar visibility
    if (searchToggle && searchForm) {
        searchToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            searchForm.classList.toggle("active");
            if (searchForm.classList.contains("active") && searchInput) {
                searchInput.focus();
            }
        });
    }

    // Search events (Clicking icon or pressing Enter)
    if (submitSearchBtn) submitSearchBtn.addEventListener("click", handleSearch);
    
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
            }
        });
    }


    // ==========================================
    // 4. MOBILE DRAWER NAVIGATION & GLOBAL CLOSES
    // ==========================================
    const mobileMenuBtn = document.querySelector(".menu-icon");
    const navbar = document.querySelector(".navbar");

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            navbar.classList.toggle("active");
            // Automatically close search if mobile nav opens
            if (searchForm) searchForm.classList.remove("active");
        });
    }

    // UI UX fix: Close dropdowns if user clicks outside of them
    document.addEventListener("click", (e) => {
        const target = e.target;

        // Outside search area click?
        if (searchForm && !searchForm.contains(target) && !searchToggle?.contains(target)) {
            searchForm.classList.remove("active");
        }
        // Outside navbar area click?
        if (navbar && !navbar.contains(target) && !mobileMenuBtn?.contains(target)) {
            navbar.classList.remove("active");
        }
    });


    // ==========================================
    // 5. VIDEO SHOWCASE SLIDER
    // ==========================================
    const videoItems = document.querySelectorAll(".video-item");
    const prevVideoBtn = document.querySelector(".prev-btn");
    const nextVideoBtn = document.querySelector(".next-btn");

    if (videoItems.length && prevVideoBtn && nextVideoBtn) {
        let currentVideoIdx = 0;

        const switchVideo = (targetIdx) => {
            videoItems[currentVideoIdx].classList.remove("active");
            // Looping trick keeping bounds clean
            currentVideoIdx = (targetIdx + videoItems.length) % videoItems.length;
            videoItems[currentVideoIdx].classList.add("active");
        };

        nextVideoBtn.addEventListener("click", () => switchVideo(currentVideoIdx + 1));
        prevVideoBtn.addEventListener("click", () => switchVideo(currentVideoIdx - 1));
    }


    // ==========================================
    // 6. DYNAMIC CUSTOMER FEEDBACK
    // ==========================================
    const feedbackForm = document.getElementById("feedbackForm");
    const reviewContainer = document.querySelector(".review-container");

    if (feedbackForm && reviewContainer) {
        feedbackForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const name = document.getElementById("userName").value;
            const score = parseInt(document.getElementById("userRating").value) || 0;
            const message = document.getElementById("userMessage").value;

            // Generate star ratings dynamically
            const ratingStars = "★".repeat(score) + "☆".repeat(5 - score);

            // Construct and inject the new feedback item
            const feedbackCard = document.createElement("div");
            feedbackCard.className = "review-card";
            feedbackCard.innerHTML = `
                <h3>${name}</h3>
                <p>"${message}"</p>
                <div class="stars">${ratingStars}</div>
            `;

            // Prepend so new feedback stays at the top of the feed
            reviewContainer.insertBefore(feedbackCard, reviewContainer.firstChild);
            
            // Clean up
            this.reset();
            alert("Thank you for your sweet feedback!");
        });
    }
});