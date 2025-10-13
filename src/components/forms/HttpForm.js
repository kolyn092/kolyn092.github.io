import React from 'react';
import { useHttp, useFormData } from '../../hooks/useHttp';
import FormField from './FormField';

// HTTP 통신을 위한 기본 폼 컴포넌트
const HttpForm = React.memo(function HttpForm({
  title,
  fields = [],
  onSubmit,
  submitText = '제출',
  resetText = '초기화',
  showReset = true,
  className = '',
  children,
}) {
  const { formData, errors, updateField, reset: resetForm, validate } = useFormData();
  const { loading, error: httpError, reset: resetHttp } = useHttp();

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    updateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    const validationRules = {};
    fields.forEach(field => {
      if (field.validation) {
        validationRules[field.name] = field.validation;
      }
    });

    if (!validate(validationRules)) {
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleReset = () => {
    resetForm();
    resetHttp();
  };

  return (
    <div className={`http-form ${className}`}>
      {title && <h2 className="form-title">{title}</h2>}
      
      <form onSubmit={handleSubmit} className="form">
        {fields.map((field) => (
          <FormField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={handleFieldChange(field.name)}
            error={errors[field.name]}
            placeholder={field.placeholder}
            required={field.required}
            disabled={loading}
            {...field.props}
          >
            {field.options && field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormField>
        ))}
        
        {children}
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '처리 중...' : submitText}
          </button>
          
          {showReset && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="btn btn-secondary"
            >
              {resetText}
            </button>
          )}
        </div>
        
        {httpError && (
          <div className="form-error-message">
            {httpError}
          </div>
        )}
      </form>
    </div>
  );
});

export default HttpForm;
