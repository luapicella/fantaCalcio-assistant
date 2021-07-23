import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';


const LoadingButton = (props) => {
  const { type, loading, action, variant } = props

  return (
    <Button
      type={type}
      variant={variant}
      disabled={loading}
    >
      {loading ? 'Loading…' : action}
    </Button>
  );
}

export default LoadingButton;
