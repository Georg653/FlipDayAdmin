// src/components/admin/LearningPagesManagement/LearningPageForm.tsx
import React from 'react';
import { useLearningPageForm } from '../../../hooks/admin/LearningPagesManagement/useLearningPageForm';
import type { LearningPageFormOptions, LearningPage } from '../../../types/admin/LearningPages/learningPage.types';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Textarea } from '../../ui/TextArea/Textarea';
// import { Select, SelectOption } from '../../ui/Select/Select'; // Для subtopic_id, если будет API
import '../../../styles/admin/ui/Form.css';

interface LearningPageFormPropsExtended extends LearningPageFormOptions {
  setShowForm: (show: boolean) => void;
}

export const LearningPageForm: React.FC<LearningPageFormPropsExtended> = ({
  onSuccess,
  learningPageToEdit,
  setShowForm,
  subtopicIdForCreate, // Принимаем subtopicIdForCreate из родительского компонента
}) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    formError,
    resetForm,
  } = useLearningPageForm({
    onSuccess: (data: LearningPage) => {
      onSuccess?.(data);
      setShowForm(false); // Закрываем форму после успешного сохранения
      resetForm();       // Сбрасываем состояние формы
    },
    learningPageToEdit,
    subtopicIdForCreate, // Передаем в хук
  });

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        {learningPageToEdit ? 'Редактировать страницу обучения' : 'Создать страницу обучения'}
      </h3>
      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          {/* Subtopic ID - пока инпут, в будущем селект */}
          <div className="form-group">
            <label htmlFor="subtopic_id_lp">ID Подтемы*</label>
            <Input
              id="subtopic_id_lp"
              name="subtopic_id"
              type="number"
              value={formData.subtopic_id}
              onChange={handleChange}
              placeholder="Введите ID родительской подтемы"
              disabled={isSubmitting || !!learningPageToEdit} // Блокируем при редактировании, т.к. subtopic_id не меняется у страницы
              required
            />
            {/* Если будет API для подтем:
            <Select
              id="subtopic_id_lp"
              name="subtopic_id"
              label="Подтема*"
              value={formData.subtopic_id}
              onChange={handleChange} // или handleSelectChange
              options={subtopicOptions || []} // subtopicOptions должны приходить как пропс
              placeholder="Выберите подтему"
              disabled={isSubmitting || !!learningPageToEdit}
              required
            /> */}
          </div>

          {/* Page Number */}
          <div className="form-group">
            <label htmlFor="page_number_lp">Номер страницы*</label>
            <Input
              id="page_number_lp"
              name="page_number"
              type="number"
              value={formData.page_number}
              onChange={handleChange}
              placeholder="Порядковый номер страницы в подтеме"
              disabled={isSubmitting}
              required
              min="1" // Номер страницы должен быть >= 1
            />
          </div>

          {/* Content (JSON String) */}
          <div className="form-group">
            <label htmlFor="content_json_string_lp">Содержимое страницы (JSON)*</label>
            <Textarea
              id="content_json_string_lp"
              name="content_json_string"
              value={formData.content_json_string}
              onChange={handleChange}
              placeholder='Введите JSON массив блоков контента. Например: [{"type":"text", "content":"Привет!"}]'
              disabled={isSubmitting}
              required
              rows={10} // Увеличим количество строк для удобства
              spellCheck="false" // Отключаем проверку орфографии для JSON
            />
            <small className="form-text text-muted" style={{ marginTop: '0.25rem', fontSize: '0.8em' }}>
              Необходимо ввести валидный JSON массив объектов. Каждый объект - блок контента.
              <br/>Пример блока: <code>{`{"type":"text", "content":"Текст вашего блока"}`}</code>
              <br/>Другой пример: <code>{`{"type":"heading", "level":1, "content":"Заголовок H1"}`}</code>
            </small>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" disabled={isSubmitting} customVariant="save" variant="success">
            {isSubmitting
              ? learningPageToEdit ? 'Сохранение...' : 'Создание...'
              : learningPageToEdit ? 'Сохранить изменения' : 'Создать страницу'}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            customVariant="cancel"
            variant="outline"
          >
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
};