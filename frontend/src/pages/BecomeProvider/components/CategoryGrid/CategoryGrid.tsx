import { useFormContext } from 'react-hook-form';
import type { ProviderFormData } from '../../BecomeProvider';

const defaultCategories = [
  'Eletricista',
  'Encanador',
  'Diarista',
  'Pintor',
  'Jardineiro',
  'Marceneiro',
  'Pedreiro',
  'Chaveiro',
  'Técnico de Informática',
  'Professor Particular',
];

export default function CategoryGrid() {
  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProviderFormData>();

  const selectedCategories = watch('categories') || [];

  const toggleCategory = (categoryName: string) => {
    const current = getValues('categories') || [];
    const updated = current.includes(categoryName)
      ? current.filter((c) => c !== categoryName)
      : [...current, categoryName];

    setValue('categories', updated, { shouldValidate: true, shouldTouch: true });
  };

  return (

    <div className="form-group" role="group" aria-labelledby="category-grid-title">

      <h3 id="category-grid-title" className="form-label-title">

        Categorias de Atuação

      </h3>

      <p className="field-hint">Selecione uma ou mais categorias:</p>

      <div className="categories-grid">
        {defaultCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              type="button"
              className={`category-chip ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCategory(category)}
            >
              <span className="chip-icon">{isSelected ? '✓' : '+'}</span>
              {category}
            </button>
          );
        })}
      </div>

      {errors.categories && (
        <span className="error-text">{errors.categories.message}</span>
      )}
    </div>
  );
}