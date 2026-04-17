import { LoaderCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field';
import { Input } from './ui/input';
import { Link } from 'react-router';
import type { SignupSchemaType } from '@/schemas/auth.schema';
import type { SyntheticEvent } from 'react';
import type { FormErrors } from '@/types/auth.types';
import { useAuthStore } from '@/store/useAuthStore';

interface SignUpFormProps {
  formData: SignupSchemaType;
  onChange: (field: keyof SignupSchemaType, value: string) => void;
  errors: FormErrors<SignupSchemaType>;
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

const SignUpForm = ({ onSubmit, onChange, errors, formData }: SignUpFormProps) => {
  const { isSigningUp } = useAuthStore();

  return (
    <form
      onSubmit={onSubmit}
      className="border-l-echo-border bg-echo-bg/75 flex w-120 flex-col justify-center border px-12 backdrop-blur-xl"
    >
      <FieldSet>
        <FieldLegend>
          <h2 className="text-2xl">Sign up</h2>
        </FieldLegend>
        <FieldDescription>Create an account</FieldDescription>
        <FieldGroup className="mt-2">
          <Field>
            <FieldLabel htmlFor="name" variant="silent">
              Name
            </FieldLabel>
            <Input
              value={formData.name}
              onChange={event => onChange('name', event.target.value)}
              id="name"
              name="name"
              autoComplete="off"
              placeholder="Danny"
              aria-invalid={!!errors.name}
            />
            <FieldError>{errors.name}</FieldError>
            <FieldDescription>This appears on your account</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email" variant="silent">
              Email
            </FieldLabel>
            <Input
              value={formData.email}
              onChange={event => onChange('email', event.target.value)}
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              aria-invalid={!!errors.email}
            />
            <FieldError>{errors.email}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password" variant="silent">
              Password
            </FieldLabel>
            <Input
              value={formData.password}
              onChange={event => onChange('password', event.target.value)}
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
            />
            <FieldError>{errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="repeatPassword" variant="silent">
              Repeat password
            </FieldLabel>
            <Input
              value={formData.repeatPassword}
              onChange={event => onChange('repeatPassword', event.target.value)}
              type="password"
              id="repeatPassword"
              autoComplete="off"
              aria-invalid={!!errors.repeatPassword}
            />
            <FieldError>{errors.repeatPassword}</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button variant="primary" type="submit" className="mt-6 h-12">
        {isSigningUp ? <LoaderCircle className="size-6 shrink-0 animate-spin" /> : 'Sign up'}
      </Button>
      <div className="mt-2 text-sm">
        Already have an account?
        <Button asChild variant="link" className="ml-1 h-fit! p-0">
          <Link to="../login">Log in</Link>
        </Button>
      </div>
    </form>
  );
};

export default SignUpForm;
