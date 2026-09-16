import { useNavigate } from 'react-router-dom';
import './HomeCategories.css';

// Lista de categorias de serviços em destaque
const CATEGORIES = [
  { id: 'Eletricista', name: 'Eletricista', icon: '⚡' },
  { id: 'Encanador', name: 'Encanador', icon: '🚰' },
  { id: 'Diarista', name: 'Diarista', icon: '🧹' },
  { id: 'Pintor', name: 'Pintor', icon: '🎨' },
  { id: 'Jardineiro', name: 'Jardineiro', icon: '🌱' },
  { id: 'Marceneiro', name: 'Marceneiro', icon: '🪚' },
  { id: 'Pedreiro', name: 'Pedreiro', icon: '🧱' },
  { id: 'Chaveiro', name: 'Chaveiro', icon: '🔑' },
  { id: 'Técnico de Informática', name: 'Técnico de Informática', icon: '💻' },
  { id: 'Professor Particular', name: 'Professor Particular', icon: '📚' },
];

export default function HomeCategories() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/servicos?categoria=${categoryId}`);
  };

  return (
    <section className="categories-section">
      <h2>Categorias em Destaque</h2>
      <p>Clique em uma categoria para filtrar os serviços disponíveis</p>

      <div className="categories-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="category-card"
            onClick={() => handleCategoryClick(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            <span className="category-name">{cat.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}