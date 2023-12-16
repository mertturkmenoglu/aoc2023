export const DecoratorKeys = {
  EXPECT: 'EXPECT',
  SAMPLE: 'SAMPLE',
} as const;

export function Expect(value: number | string): MethodDecorator {
  return (target: object, key: string | symbol) => {
    Reflect.defineMetadata(DecoratorKeys.EXPECT, value, target, key);
  };
}

export function Sample(value: number | string): MethodDecorator {
  return (target: object, key: string | symbol) => {
    Reflect.defineMetadata(DecoratorKeys.SAMPLE, value, target, key);
  };
}
