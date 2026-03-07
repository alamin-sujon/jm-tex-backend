import { ZodError } from 'zod';

const reformZodError = (err: ZodError) => {
  // Map all issues safely
  const errorSource = err.issues.map((issue) => {
    const path = issue.path.length
      ? String(issue.path[issue.path.length - 1])
      : 'root';
    return {
      path,
      message: issue.message ?? 'Invalid value',
    };
  });

  // Summary message
  const errorMessage = errorSource.map((err) => `${err.path}`).join(', ');

  return {
    message: `Validation Error: ${errorMessage} is required`,
    errorSource,
  };
};

export default reformZodError;
