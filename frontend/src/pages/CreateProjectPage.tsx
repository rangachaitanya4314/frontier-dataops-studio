import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/FormControls';
import { Badge } from '../components/ui/Badge';
import { Card, CardBody } from '../components/ui/Card';
import { createProject } from '../lib/api';
import type { AnnotationType, CreateProjectInput } from '../types';

const STEPS = ['Project Info', 'Dataset Config', 'Review & Create'];

const annotationTypes: { value: AnnotationType; label: string; description: string }[] = [
  { value: 'bounding_box', label: 'Bounding Box', description: 'Draw rectangles around objects' },
  { value: 'classification', label: 'Classification', description: 'Assign class labels to items' },
  { value: 'segmentation', label: 'Segmentation', description: 'Pixel-level region labeling' },
  { value: 'ner', label: 'Named Entity Recognition', description: 'Label spans in text' },
];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateProjectInput>({
    name: '',
    description: '',
    tags: [],
    annotationType: 'bounding_box',
    classLabels: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [labelInput, setLabelInput] = useState('');

  const set = <K extends keyof CreateProjectInput>(key: K, value: CreateProjectInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t]);
      setTagInput('');
    }
  };

  const addLabel = () => {
    const l = labelInput.trim();
    if (l && !form.classLabels.includes(l)) {
      set('classLabels', [...form.classLabels, l]);
      setLabelInput('');
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Project name is required';
    }
    if (step === 1) {
      if (form.classLabels.length === 0) e.classLabels = 'Add at least one class label';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    try {
      await createProject(form);
      navigate('/projects');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Create Project</h1>
          <p className="text-sm text-text-muted mt-0.5">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-accent' : 'bg-surface-3'}`} />
            <p className={`text-xs mt-1.5 ${i <= step ? 'text-accent font-medium' : 'text-text-muted'}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardBody className="space-y-5">
          {step === 0 && (
            <>
              <Input
                label="Project Name"
                placeholder="e.g., Street Scene Detection v2"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                error={errors.name}
              />
              <Textarea
                label="Description"
                placeholder="Describe the purpose and scope of this project..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={3}
              />
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1.5">Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button variant="secondary" onClick={addTag}>Add</Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="accent">
                        {tag}
                        <button
                          onClick={() => set('tags', form.tags.filter((t) => t !== tag))}
                          className="ml-1 hover:text-error cursor-pointer"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Select
                label="Annotation Type"
                value={form.annotationType}
                onChange={(e) => set('annotationType', e.target.value as AnnotationType)}
              >
                {annotationTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label} — {t.description}</option>
                ))}
              </Select>
              <div>
                <label className="text-sm font-medium text-text-secondary block mb-1.5">Class Labels</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., car, pedestrian, cyclist..."
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                    className="flex-1"
                  />
                  <Button variant="secondary" onClick={addLabel}>Add</Button>
                </div>
                {errors.classLabels && <span className="text-xs text-error mt-1">{errors.classLabels}</span>}
                {form.classLabels.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {form.classLabels.map((label) => (
                      <Badge key={label} variant="info">
                        {label}
                        <button
                          onClick={() => set('classLabels', form.classLabels.filter((l) => l !== label))}
                          className="ml-1 hover:text-error cursor-pointer"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Review your project configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Name</span>
                  <p className="font-medium text-text-primary">{form.name || '—'}</p>
                </div>
                <div>
                  <span className="text-text-muted">Annotation Type</span>
                  <p className="font-medium text-text-primary capitalize">{form.annotationType.replace('_', ' ')}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-text-muted">Description</span>
                  <p className="font-medium text-text-primary">{form.description || '—'}</p>
                </div>
                <div>
                  <span className="text-text-muted">Tags</span>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {form.tags.length > 0 ? form.tags.map((t) => <Badge key={t}>{t}</Badge>) : <span className="text-text-muted">None</span>}
                  </div>
                </div>
                <div>
                  <span className="text-text-muted">Class Labels</span>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {form.classLabels.map((l) => <Badge key={l} variant="info">{l}</Badge>)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prev} disabled={step === 0}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={submit} disabled={submitting}>
            <Check className="w-4 h-4" /> {submitting ? 'Creating...' : 'Create Project'}
          </Button>
        )}
      </div>
    </div>
  );
}
