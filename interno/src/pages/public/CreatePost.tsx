import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../api/blogApi';
import { tagApi } from '../../api/tagApi';
import { categoryApi } from '../../api/categoryApi';
import type { CreatePostCredentials, Tag, Category } from '../../types';
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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
  const [imageUploaded, setImageUploaded] = useState(false);
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
    setImageUploaded(true);
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
        const firstError = document.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setSubmitting(true);
    try {
      await blogApi.create(form);
      navigate('/blog');
    } catch (error: any) {
      setErrors({
        submit: 'Failed to create post'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Post
        </Typography>

        {errors.submit && (
          <Typography color="error" mb={2} data-error="true">
            {errors.submit}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>

            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
              disabled={submitting}
            />

            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
              error={!!errors.description}
              helperText={errors.description}
              disabled={submitting}
            />

            <Box>
              <Box display="flex">
                <Typography variant="subtitle1" gutterBottom>
                  Featured Image *
                </Typography>
                {errors.image && (
                  <Typography color="error" data-error="true" sx={{ ml: 1 }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={submitting}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imageUploaded && (
                  <CheckCircleIcon sx={{ color: 'green', fontSize: 28 }} />
                )}
              </Box>
              <Typography variant="caption" display="block">
                JPG, PNG (max 5MB)
              </Typography>
            </Box>

            <Box>
              <Box display="flex">
                <Typography gutterBottom>
                  Tags *
                </Typography>
                {errors.tagIds && (
                  <Typography color="error" data-error="true" sx={{ ml: 1 }}>
                    {errors.tagIds}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    clickable
                    color={
                      form.tagIds.includes(tag.id)
                        ? "primary"
                        : "default"
                    }
                    onClick={() => handleTagToggle(tag.id)}
                    disabled={submitting}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Box display="flex">
                <Typography gutterBottom>
                  Categories *
                </Typography>
                {errors.categoryIds && (
                  <Typography color="error" data-error="true" sx={{ ml: 1 }}>
                    {errors.categoryIds}
                  </Typography>
                )}
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    clickable
                    color={
                      form.categoryIds.includes(category.id)
                        ? "secondary"
                        : "default"
                    }
                    onClick={() =>
                      handleCategoryToggle(category.id)
                    }
                    disabled={submitting}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Box display="flex">
                <Typography gutterBottom>
                  Content *
                </Typography>
                {errors.content && (
                  <Typography color="error" data-error="true" sx={{ ml: 1 }}>
                    {errors.content}
                  </Typography>
                )}
              </Box>
              <MdEditor
                style={{ height: "400px" }}
                value={form.content}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />

            </Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{
                backgroundColor: "#292F36",
                color: "#CDA274",
                "&:hover": {
                  backgroundColor: "#1f242a",
                },
                py: 1.5,
              }}
            >
              {submitting ? "Creating post..." : "Create Post"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;