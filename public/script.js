const categorySelect = document.getElementById('category-select');
const productsTableBody = document.getElementById('products-table-body');
const loadMoreButton = document.getElementById('load-more-btn');
const statusMessage = document.getElementById('status-message');

let nextCursor = null;
let currentCategory = 'All';
let isLoading = false;

function createProductRow(product) {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = product.name || '—';
  row.appendChild(nameCell);

  const categoryCell = document.createElement('td');
  categoryCell.textContent = product.category || '—';
  row.appendChild(categoryCell);

  const priceCell = document.createElement('td');
  priceCell.textContent = product.price != null ? `$${product.price.toFixed(2)}` : '—';
  row.appendChild(priceCell);

  const createdAtCell = document.createElement('td');
  createdAtCell.textContent = product.createdAt
    ? new Date(product.createdAt).toLocaleString()
    : '—';
  row.appendChild(createdAtCell);

  return row;
}

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
}

function setLoading(loading) {
  isLoading = loading;
  loadMoreButton.disabled = loading;
  loadMoreButton.textContent = loading ? 'Loading...' : 'Load More';
  if (loading) {
    setStatus('Loading products...', false);
  }
}

function buildUrl() {
  const params = new URLSearchParams();

  if (currentCategory !== 'All') {
    params.append('category', currentCategory);
  }

  if (nextCursor) {
    params.append('cursor', nextCursor);
  }

  const queryString = params.toString();
  return `/products${queryString ? `?${queryString}` : ''}`;
}

async function fetchProducts(isFirstPage = false) {
  if (isLoading) {
    return;
  }

  try {
    setLoading(true);
    setStatus('');

    if (isFirstPage) {
      productsTableBody.innerHTML = '';
      nextCursor = null;
    }

    const url = buildUrl();
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.products)) {
      throw new Error('Unexpected response format');
    }

    if (data.products.length === 0 && isFirstPage) {
      setStatus('No products found for this category.');
      loadMoreButton.style.display = 'none';
      return;
    }

    data.products.forEach((product) => {
      const row = createProductRow(product);
      productsTableBody.appendChild(row);
    });

    nextCursor = data.nextCursor;
    loadMoreButton.style.display = nextCursor ? 'inline-flex' : 'none';

    setStatus('');
  } catch (error) {
    console.error(error);
    setStatus('Unable to load products. Please try again.', true);
  } finally {
    setLoading(false);
  }
}

categorySelect.addEventListener('change', () => {
  currentCategory = categorySelect.value;
  nextCursor = null;
  fetchProducts(true);
});

loadMoreButton.addEventListener('click', () => {
  fetchProducts(false);
});

window.addEventListener('DOMContentLoaded', () => {
  fetchProducts(true);
});
