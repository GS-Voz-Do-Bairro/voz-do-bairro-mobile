import React from 'react';
import EmptyState from './EmptyState';
import { mensagemDeErro } from '../utils/apiError';

export default function ErrorState({ error, onRetry }) {
  return (
    <EmptyState
      icon="wifi-off"
      title="Não foi possível carregar"
      message={mensagemDeErro(error)}
      actionLabel="Tentar de novo"
      onAction={onRetry}
    />
  );
}
