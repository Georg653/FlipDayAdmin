// src/components/admin/LearningPagesManagement/LearningPageForm.tsx
import React, { useState, useEffect } from 'react';
import { useLearningPageForm } from '../../../hooks/admin/LearningPagesManagement/useLearningPageForm';
import { useContentBlockForm } from '../../../hooks/admin/LearningPagesManagement/useContentBlockForm';
import type { LearningPageFormProps } from '../../../types/admin/LearningPages/learningPage_props.types';
import type { LearningPage, LearningPageContentBlockUIData, LearningPageQuizOption } from '../../../types/admin/LearningPages/learningPage.types';
import { LearningPageBlockType, LEARNING_PAGE_BLOCK_TYPE_OPTIONS } from '../../../constants/admin/LearningPages/learningPages.constants';
import type { LearningPageBlockTypeEnum } from '../../../constants/admin/LearningPages/learningPages.constants';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import { Textarea } from '../../ui/TextArea/Textarea';
import '../../../styles/admin/ui/Form.css';
import './LearningPageForm.css';

interface ContentBlockFormInternalProps {
  initialBlockData?: Partial<LearningPageContentBlockUIData>;
  onSave: (blockData: LearningPageContentBlockUIData) => void;
  onCancel: () => void;
  existingBlockIdsInPage: string[];
}

const ContentBlockForm: React.FC<ContentBlockFormInternalProps> = ({ initialBlockData, onSave, onCancel, existingBlockIdsInPage }) => {
  const {
    type, setType, level, setLevel, content, setContent, src, setSrc,
    text, setText, question, setQuestion, options, message, setMessage,
    correctOptionId, setCorrectOptionId,
    fileInput, previewUrl, handleFileChange,
    getBlockData, addOption, updateOptionText, removeOption,
  } = useContentBlockForm({ initialBlockData, existingBlockIdsInPage });

  const handleSave = () => { onSave(getBlockData()); };

  return (
    <div className="content-block-form">
      <h4>{initialBlockData?._localId ? 'Редактировать блок' : 'Добавить новый блок'}</h4>
      <div className="form-group">
        <label>Тип блока*</label>
        <Select value={type} onChange={(e) => setType(e.target.value as LearningPageBlockTypeEnum)} options={LEARNING_PAGE_BLOCK_TYPE_OPTIONS} disabled={!!initialBlockData?._localId} />
      </div>
      
      {type === LearningPageBlockType.HEADING && (<>
        <div className="form-group"><label>Уровень (1-6)*</label><Input type="number" value={level} onChange={(e) => setLevel(parseInt(e.target.value,10) || 1)} min="1" max="6" /></div>
        <div className="form-group"><label>Текст*</label><Input value={content} onChange={(e) => setContent(e.target.value)} /></div>
      </>)}

      {type === LearningPageBlockType.TEXT && (<div className="form-group"><label>Текст*</label><Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} /></div>)}

      {(type === LearningPageBlockType.IMAGE || type === LearningPageBlockType.VIDEO || type === LearningPageBlockType.AUDIO) && (<>
        <div className="form-group">
            <label>Файл ресурса (для {type})</label>
            <Input type="file" onChange={handleFileChange} accept={type === LearningPageBlockType.IMAGE ? "image/*" : (type === LearningPageBlockType.VIDEO ? "video/*" : "audio/*")} />
            {previewUrl && <div className="image-upload-preview-area">
                {type === LearningPageBlockType.IMAGE && <img src={previewUrl} alt="Превью" className="image-upload-preview" />}
                {type === LearningPageBlockType.VIDEO && <video src={previewUrl} controls className="image-upload-preview">Видео не поддерживается</video>}
                {type === LearningPageBlockType.AUDIO && <audio src={previewUrl} controls className="image-upload-preview">Аудио не поддерживается</audio>}
            </div>}
        </div>
        <div className="form-group">
          <label>Или URL ресурса (src)</label>
          <Input value={typeof src === 'string' ? src : ''} onChange={(e) => { setSrc(e.target.value); if(e.target.value && fileInput) handleFileChange({ target: { files: null } } as any);}} placeholder="https://example.com/..." disabled={!!fileInput} />
        </div>
        <div className="form-group">
          <label>Подпись/Альт. текст</label><Input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
      </>)}

      {(type === LearningPageBlockType.ALBUM || type === LearningPageBlockType.SLIDER) && (<div className="form-group">
        <label>URL ресурсов (src, каждый с новой строки)*</label>
        <Textarea value={Array.isArray(src) ? src.join('\n') : src as string} onChange={(e) => setSrc(e.target.value.split('\n').map(s => s.trim()).filter(s => s))} rows={5} placeholder={"URL1\nURL2"} />
         {Array.isArray(src) && src.length > 0 && <div style={{marginTop: '10px'}}>Превью первого: <img src={src[0]} alt="preview" style={{maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }} /></div>}
      </div>)}

      {type === LearningPageBlockType.TEST && (<>
        <div className="form-group"><label>Вопрос*</label><Input value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
        <label>Варианты ответа (отметьте правильный):</label>
        {options.map((opt, index) => (<div key={opt.id} className="form-group-inline test-option-item">
            <Input type="radio" name={`correct_option_radio_${initialBlockData?._localId || 'new'}`} id={`option_radio_${opt.id}`} value={opt.id} checked={correctOptionId === opt.id} onChange={(e) => setCorrectOptionId(e.target.value)} style={{ marginRight: '8px', width: 'auto' }}/>
            <label htmlFor={`option_radio_${opt.id}`} style={{flexGrow: 0, marginRight: '8px', marginBottom: 0, cursor: 'pointer'}}>Текст:</label>
            <Input style={{flexGrow: 1}} value={opt.text} onChange={(e) => updateOptionText(index, e.target.value)} placeholder={`Вариант ${index + 1}`} />
            {options.length > 1 && <Button type="button" variant='link' onClick={() => removeOption(index)} className='remove-option-btn'>Удалить</Button>}
        </div>))}
        <Button type="button" variant='outline' size='sm' onClick={addOption} style={{marginTop: '0.5rem'}}>Добавить вариант</Button>
        <div className="form-group" style={{marginTop: '1rem'}}><label>Сообщение</label><Input value={message} onChange={(e) => setMessage(e.target.value)} /></div>
      </>)}
      <div className="form-actions"><Button type="button" onClick={handleSave} customVariant="save" variant="success">Сохранить блок</Button><Button type="button" onClick={onCancel} variant="outline">Отмена</Button></div>
    </div>
  );
};

export const LearningPageForm: React.FC<LearningPageFormProps> = ({ 
    onSuccess, 
    learningPageToEdit, 
    setShowForm, 
    subtopicIdForCreate,
}) => {
  const { 
    formData, handleChange: handleMainFormChange, handleSubmit: handleMainFormSubmit, 
    isSubmitting, formError, resetForm, 
    addContentBlock, updateContentBlock, deleteContentBlock,
    moveContentBlock // Получаем функцию для перемещения
  } = useLearningPageForm({ onSuccess, learningPageToEdit, subtopicIdForCreate });

  const [editingBlock, setEditingBlock] = useState<LearningPageContentBlockUIData | null>(null);
  const [showBlockEditor, setShowBlockEditor] = useState<boolean>(false);

  const handleAddNewBlockClick = () => { setEditingBlock(null); setShowBlockEditor(true); };
  const handleEditBlockClick = (blockToEdit: LearningPageContentBlockUIData) => { setEditingBlock(blockToEdit); setShowBlockEditor(true); };
  
  const handleSaveBlockToList = (blockData: LearningPageContentBlockUIData) => {
    if (editingBlock && editingBlock._localId) {
      updateContentBlock(editingBlock._localId, blockData);
    } else {
      addContentBlock(blockData);
    }
    setShowBlockEditor(false); setEditingBlock(null);
  };
  
  const handleCancelMainForm = () => { setShowForm(false); resetForm(); };

  return (
    <div className="form-container learning-page-form-container">
      <h3 className="form-title">{learningPageToEdit ? 'Редактировать страницу' : 'Создать страницу'}</h3>
      {formError && <p className="form-error">{formError}</p>}
      <form onSubmit={handleMainFormSubmit}>
        <div className="form-group"><label htmlFor="subtopic_id_lp_main">ID Подтемы*</label><Input id="subtopic_id_lp_main" name="subtopic_id" type="number" value={formData.subtopic_id} onChange={handleMainFormChange} disabled={isSubmitting || !!learningPageToEdit} required /></div>
        <div className="form-group"><label htmlFor="page_number_lp_main">Номер страницы*</label><Input id="page_number_lp_main" name="page_number" type="number" value={formData.page_number} onChange={handleMainFormChange} disabled={isSubmitting} required min="1" /></div>
        <hr style={{ margin: '20px 0' }}/>
        <h4>Блоки контента</h4>
        <div className="content-blocks-list">
          {formData.current_content_blocks.map((block, index) => (
            <div key={block._localId} className="content-block-item">
              <div className="content-block-item-info">
                <span>Тип: <strong>{block.type}</strong> (#{index + 1})</span>
                {block.previewUrl && (block.type === LearningPageBlockType.IMAGE || block.type === LearningPageBlockType.VIDEO || block.type === LearningPageBlockType.AUDIO) && (
                   <div className="content-block-visual-preview-small">
                    {block.type === LearningPageBlockType.IMAGE && <img src={block.previewUrl} alt="preview" />}
                    {block.type === LearningPageBlockType.VIDEO && <video src={block.previewUrl} width="80" height="50" />}
                    {block.type === LearningPageBlockType.AUDIO && <audio src={block.previewUrl} controls />}
                   </div>
                )}
                 <p className="content-block-preview-text">
                    {(block.content || block.question || (Array.isArray(block.src) && block.src.length > 0 ? `URLs: ${block.src.length}` : typeof block.src === 'string' && !block.fileInput ? block.src : block.fileInput?.name ) || 'Блок').substring(0,50)}...
                 </p>
              </div>
              <div className="content-block-item-actions">
                <Button type="button" variant="outline" size="sm" onClick={() => moveContentBlock(index, index - 1)} disabled={index === 0} title="Вверх" style={{padding: '0.25rem 0.5rem'}}>↑</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => moveContentBlock(index, index + 1)} disabled={index === formData.current_content_blocks.length - 1} title="Вниз" style={{padding: '0.25rem 0.5rem'}}>↓</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleEditBlockClick(block)}>Ред.</Button>
                <Button type="button" variant="link" className="table-action-button-delete" size="sm" onClick={() => deleteContentBlock(block._localId)}>Удал.</Button>
              </div>
            </div>
          ))}
          {formData.current_content_blocks.length === 0 && <p>Нет блоков контента.</p>}
        </div>
        {!showBlockEditor && (<Button type="button" onClick={handleAddNewBlockClick} variant="outline" style={{ marginTop: '1rem' }}>Добавить блок</Button>)}
        {showBlockEditor && (<ContentBlockForm key={editingBlock?._localId || 'newBlockForm'} initialBlockData={editingBlock || undefined} onSave={handleSaveBlockToList} onCancel={() => { setShowBlockEditor(false); setEditingBlock(null); }} existingBlockIdsInPage={formData.current_content_blocks.map(b => b._localId)} />)}
        <hr style={{ margin: '20px 0' }}/>
        <div className="form-actions"><Button type="submit" disabled={isSubmitting || showBlockEditor} customVariant="save" variant="success">{isSubmitting ? 'Сохранение...' : (learningPageToEdit ? 'Сохранить страницу' : 'Создать страницу')}</Button><Button type="button" onClick={handleCancelMainForm} disabled={isSubmitting} customVariant="cancel" variant="outline">Отмена</Button></div>
      </form>
    </div>
  );
};