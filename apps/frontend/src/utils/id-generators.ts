export const generateOperationId = (): string => `op-${crypto.randomUUID()}`;

export const generateConditionId = (): string => `con-${crypto.randomUUID()}`;

export const generateFormulaId = (): string => `for-${crypto.randomUUID()}`;

export const generateBranchId = (): string => `br-${crypto.randomUUID()}`;

export const generateOperationGroupId = (nodeId: string, side: 'IF' | 'ELSE'): string => 
  `opgrp-${nodeId}-${side}`;
