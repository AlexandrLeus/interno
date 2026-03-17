import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../api/blogApi';
import { tagApi } from '../../api/tagApi';
import { categoryApi } from '../../api/categoryApi';
import type { CreatePostCredentials, Tag, Category } from '../../types';
import styles from './CreatePost.module.scss'
import Button from '../../components/ui/Button';
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const mdParser = new MarkdownIt();
  const [form, setForm] = useState<CreatePostCredentials>({
    title: '',
    description: '',
    content: '',
    image: null,
    tagIds: [],
    categoryIds: []
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tagsData, categoriesData] = await Promise.all([
          tagApi.getTags(),
          categoryApi.getCategories()
        ]);
        setTags(tagsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setForm(prev => ({ ...prev, content: text }));
    clearError('content');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleTagToggle = (tagId: number) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
    clearError('tagIds');
  };

  const handleCategoryToggle = (categoryId: number) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
    clearError('categoryIds');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    clearError('image');
  };
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!form.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!form.image) {
      newErrors.image = 'Image is required';
    } else if (form.image.size > 5 * 1024 * 1024) {
      newErrors.image = 'Image must be less than 5MB';
    }

    if (form.tagIds.length === 0) {
      newErrors.tagIds = 'Select at least one tag';
    }

    if (form.categoryIds.length === 0) {
      newErrors.categoryIds = 'Select at least one category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setTimeout(() => {
      const firstError = document.querySelector(`.${styles.errorMassage}`);
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },100);
      return;
    }

    setSubmitting(true);
    try {
      await blogApi.create(form);
      navigate('/blog', {
        state: { message: 'Post created successfully!' }
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create post'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.createPost}>
      <h1>Create New Post</h1>
      {errors.submit && (
        <div>{errors.submit}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">
            Title <span className={styles.required}>*</span> {errors.title && <span className={styles.errorMassage}>{errors.title}</span>}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter post title"
            disabled={submitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">
            Description <span className={styles.required}>*</span> {errors.description && <span className={styles.errorMassage}>{errors.description}</span>}
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of your post"
            rows={3}
            disabled={submitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="image">
            Featured Image <span className={styles.required}>*</span> {errors.image && <span className={styles.errorMassage}>{errors.image}</span>}
          </label>
          <div>
            <input
              type="file"
              id="image"
              accept="image/*"
              disabled={submitting}
              onChange={handleImageChange}
            />
            <p>Accepted formats: JPG, PNG (max 5MB)</p>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>
            Tags <span className={styles.required}>*</span> {errors.tagIds && <span className={styles.errorMassage}>{errors.tagIds}</span>}
          </label>
          <div>
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={form.tagIds.includes(tag.id) ? styles.active : ""}
                onClick={() => handleTagToggle(tag.id)}
                disabled={submitting}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>
            Categories <span className={styles.required}>*</span> {errors.categoryIds && <span className={styles.errorMassage}>{errors.categoryIds}</span>}
          </label>
          <div>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={form.categoryIds.includes(category.id) ? styles.active : ""}
                onClick={() => handleCategoryToggle(category.id)}
                disabled={submitting}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>
            Content <span className={styles.required}>*</span> {errors.content && <span className={styles.errorMassage}>{errors.content}</span>}
          </label>
          <MdEditor
            style={{ height: "400px" }}
            value={form.content}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />
        </div>
        <Button disabled={submitting} text={submitting ? 'Creating post...' : 'Create Post'} BackgroundColor="#292F36" arrowColor="#CDA274" />
      </form>
    </div>
  );
};

export default CreatePost;