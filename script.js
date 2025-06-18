document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const addBookForm = document.getElementById('addBookForm');
    const booksContainer = document.getElementById('booksContainer');
    const searchInput = document.getElementById('searchInput');
    
    // Array para armazenar os livros
    let books = JSON.parse(localStorage.getItem('books')) || [];
    
    // Inicializar a aplicação
    renderBooks();
    
    // Evento para adicionar livro
    addBookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const year = document.getElementById('bookYear').value.trim();
        
        if (title && author) {
            const newBook = {
                id: Date.now().toString(),
                title,
                author,
                year: year || 'Não especificado'
            };
            
            books.unshift(newBook);
            saveBooks();
            renderBooks();
            addBookForm.reset();
            
            // Feedback visual
            const submitBtn = addBookForm.querySelector('button');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Livro Adicionado!';
            submitBtn.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Adicionar Livro';
                submitBtn.style.backgroundColor = '';
            }, 2000);
        }
    });
    
    // Evento para buscar livros
    searchInput.addEventListener('input', function() {
        renderBooks();
    });
    
    // Função para renderizar os livros
    function renderBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm)
        );
        
        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = `
                <div class="empty-message fade-in">
                    <i class="fas fa-book-open"></i>
                    <p>Nenhum livro encontrado</p>
                </div>
            `;
            return;
        }
        
        booksContainer.innerHTML = '';
        
        filteredBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'book-card fade-in';
            bookElement.innerHTML = `
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-year">${book.year}</p>
                <div class="book-actions">
                    <button class="btn btn-danger delete-btn" data-id="${book.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            `;
            
            booksContainer.appendChild(bookElement);
        });
        
        // Adicionar eventos aos botões de excluir
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.getAttribute('data-id');
                deleteBook(bookId);
            });
        });
    }
    
    // Função para excluir livro
    function deleteBook(id) {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
            books = books.filter(book => book.id !== id);
            saveBooks();
            renderBooks();
        }
    }
    
    // Função para salvar livros no localStorage
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }
});