import AuthHero from '@/components/auth/AuthHero';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginSchemaType } from '@/schemas/auth.schema';
import { useAuthStore } from '@/store/useAuthStore';
import type { FormErrors } from '@/types/auth.types';
import { LoaderCircle } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import z from 'zod';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginSchemaType>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors<LoginSchemaType>>({});
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = z.treeifyError(result.error).properties;
      setErrors({
        email: fieldErrors?.email?.errors[0],
        password: fieldErrors?.password?.errors[0],
      });

      return;
    }

    login(result.data);
  };

  return (
    <section className="z-10 flex h-full w-full justify-between">
      <AuthHero />
      <form
        onSubmit={handleSubmit}
        className="border-l-echo-border bg-echo-bg/75 flex w-120 flex-col justify-center border px-12 backdrop-blur-xl"
      >
        <FieldSet>
          <FieldLegend>
            <h2 className="text-2xl">Log in</h2>
          </FieldLegend>
          <FieldDescription>Welcome back, log in to continue</FieldDescription>
          <FieldGroup className="mt-2">
            <Field>
              <FieldLabel htmlFor="email" variant="silent">
                Email
              </FieldLabel>
              <Input
                value={formData.email}
                onChange={event => setFormData({ ...formData, email: event.target.value })}
                type="email"
                id="email"
                name="email"
                autoComplete="off"
                aria-invalid={!!errors.email}
                required
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password" variant="silent">
                Password
              </FieldLabel>
              <Input
                value={formData.password}
                onChange={event => setFormData({ ...formData, password: event.target.value })}
                type="password"
                id="password"
                name="password"
                autoComplete="off"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                required
              />
              <FieldError>{errors.password}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button variant="primary" type="submit" className="shadow-echo-resting-lg hover:shadow-echo-hover-lg mt-6 h-12">
          {isLoggingIn ? <LoaderCircle className="size-6 shrink-0 animate-spin" /> : 'Log in'}
        </Button>
        <div className="mt-2 text-sm">
          Don't have an account?
          <Button asChild variant="link" className="ml-1 h-fit! p-0">
            <Link to="../signup">Sign up</Link>
          </Button>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
