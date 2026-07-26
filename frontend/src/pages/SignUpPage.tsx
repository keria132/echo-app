import { useState, type SyntheticEvent } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { signupSchema, type SignupSchemaType } from '@/schemas/auth.schema';
import z from 'zod';
import type { FormErrors } from '@/types/auth.types';
import SignUpForm from '@/components/auth/SignUpForm';
import AuthHero from '@/components/auth/AuthHero';

const SignUpPage = () => {
  const [formData, setFormData] = useState<SignupSchemaType>({ name: '', email: '', password: '', repeatPassword: '' });
  const [errors, setErrors] = useState<FormErrors<SignupSchemaType>>({});
  const { signup } = useAuthStore();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error).properties;
      setErrors({
        name: fieldErrors?.name?.errors[0],
        email: fieldErrors?.email?.errors[0],
        password: fieldErrors?.password?.errors[0],
        repeatPassword: fieldErrors?.repeatPassword?.errors[0],
      });

      return;
    }

    const { repeatPassword: _, ...payload } = result.data;

    signup(payload);
  };

  const handleChange = (field: keyof SignupSchemaType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="z-10 flex h-full w-full justify-between">
      <AuthHero className="hidden flex-1 pl-[15%] lg:flex" />
      <SignUpForm onSubmit={handleSubmit} onChange={handleChange} formData={formData} errors={errors} />
    </section>
  );
};

export default SignUpPage;
