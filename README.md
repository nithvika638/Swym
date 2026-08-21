# ApexStore - E-Commerce Storefront & Wishlist Management Hub

A modern, responsive e-commerce storefront with a multi-wishlist management system featuring wishlist merging, deduplication, and zero-backend client-side persistence designed for **GitHub Pages**.

![ApexStore Storefront](https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🛍️ 1. E-Commerce Storefront
- **Product Catalog**: High-resolution catalog containing electronics, wearables, home items, and accessories with prices, ratings, brand tags, and stock indicators.
- **Search & Filter**: Real-time keyword search across names, brands, and descriptions alongside category pill filtering.
- **Sort Options**: Sort products by featured order, price (low-to-high, high-to-low), or customer rating.
- **Product Detail Modal**: Full product specification breakdown, customer review counts, and instant wishlist management.

### 💖 2. Multiple Wishlists System
- **Create & Custom Naming**: Create unlimited wishlists with personalized titles (e.g. "Work Setup", "Birthday Ideas", "Holiday Gifts").
- **Multi-List Membership**: Add a single product to multiple wishlists or toggle membership on the fly.
- **Wishlist Selector Modal**: Seamless UI modal when adding items allows selecting destinations or creating new lists on the fly.
- **Active Wishlist Drawer**: Switch between active wishlists, view item dates, and manage list items.
- **Rename & Delete**: Instant list renaming and deletion with automatic fallback to active list.

### 🔀 3. Wishlist Merge (Core Feature)
The wishlist merge workflow allows users to merge two distinct wishlists:
1. **Source List Selection**: The list to combine into the target (permanently deleted post-merge).
2. **Target List Selection**: The destination list where combined items are stored.
3. **Live Calculation Preview**: Real-time calculation showing:
   - Source items count
   - Target items count
   - Overlap / duplicate product count
   - Resulting total unique items count after merge
4. **Deduplication Engine**: Products present in both wishlists are automatically deduplicated by `productId`.
5. **Confirmation Dialog & Rule Enforcement**: Clear warning dialog detailing source list deletion requirement before execution.

---

## 🛡️ Edge Cases Handled

1. **Self-Merge Prevention**: Attempting to merge a wishlist with itself is disabled in UI dropdowns and blocked in core utility validation.
2. **Product Deduplication**: When both wishlists contain identical products, the resulting list retains only a single instance of each product.
3. **Empty Source or Target Lists**: Merging safe handling when either source or target contains zero items.
4. **Single Wishlist**: Merge action is automatically disabled with helpful tooltip when fewer than 2 wishlists exist.
5. **Deleting Active Wishlist**: System automatically falls back to another available wishlist or displays a zero-wishlist state.
6. **Deleting Last Wishlist**: Handled gracefully with clean empty-state UI and a quick "Create Wishlist" call to action.
7. **Browser Refresh / State Sync**: Full state persistence using `localStorage`.
8. **Corrupted / Invalid localStorage**: Data structure validator (`validateWishlistsData`) detects corrupt structure and initializes safely with clean default wishlists without crashing.

---

## 📐 Data Architecture

### Wishlist Data Model

```json
{
  "id": "wishlist-1708500000000-abc12",
  "name": "Birthday Ideas",
  "createdAt": "2026-08-21T09:30:00.000Z",
  "items": [
    {
      "productId": "prod-1",
      "addedAt": "2026-08-21T09:35:00.000Z"
    },
    {
      "productId": "prod-6",
      "addedAt": "2026-08-21T09:40:00.000Z"
    }
  ]
}
```

### LocalStorage Keys
- `apex_store_wishlists_v1`: JSON array of user wishlists.
- `apex_store_active_wishlist_id_v1`: ID string of currently active wishlist.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ and npm

### Installation & Run

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/ecommerce-wishlist-storefront.git
   cd ecommerce-wishlist-storefront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🚀 GitHub Pages Deployment

This project is configured out-of-the-box for GitHub Pages deployment using relative base paths (`base: './'` in `vite.config.js`).

### Automatic Deployment via GitHub Actions

1. Push code to your GitHub repository `main` branch.
2. Navigate to repository **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build and publish your site!

---

## 🛠️ Project Structure

```text
src/
├── components/
│   ├── Header.jsx                 # Top Navbar & Navigation Tabs
│   ├── ProductCard.jsx            # Individual Product Grid Card
│   ├── ProductGrid.jsx            # Product List, Search & Filters
│   ├── ProductDetailModal.jsx     # Quick View Specs Modal
│   ├── AddToWishlistModal.jsx      # Multi-list Wishlist Selector
│   ├── WishlistSidebar.jsx        # Wishlists Switcher Drawer & Actions
│   ├── WishlistItem.jsx           # Item row in active wishlist
│   ├── MergeWishlistModal.jsx      # Visual Wishlist Merge Workflow
│   ├── CreateWishlistModal.jsx     # Create & Rename Dialog Modal
│   └── ConfirmDialog.jsx          # Reusable Confirmation Modal
├── data/
│   └── products.js                # Mock Product Catalog
├── hooks/
│   └── useWishlists.js            # Custom Hook for Wishlists & localStorage
├── utils/
│   └── wishlistUtils.js           # Pure Wishlist & Merge Utilities
├── pages/
│   ├── Storefront.jsx             # Storefront Main View
│   └── Wishlists.jsx              # Wishlist Hub View
├── App.jsx                        # Main Application Container
└── main.jsx                       # Entry Point
```
