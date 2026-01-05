import CSS_Classes from "./TextBox.module.sass";
import * as React from "react"


const TextBox: React.ForwardRefExoticComponent<TextBox.Props> = React.forwardRef(
  function TextBox(
    {
      label,
      value,
      className,
      disabled,
      readonly,
      nativeInputElementAttributes = {},
      onChangeEventHandler,
      onBlurEventHandler
    }: TextBox.Props,
    forwardedReactReference: React.ForwardedRef<TextBox.PublicMethods>
  ): React.ReactNode {

    const inputElementReactReference: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(
      forwardedReactReference,
      (): TextBox.PublicMethods => ({
        focus(): void {
          inputElementReactReference.current?.focus();
        }
      })
    );

    const inputElementID: string = React.useId();

    return (
      <div
        className={ [ CSS_Classes.rootElement, ...(className ?? "").length > 0 ? [ className ] : [] ].join(" ") }
      >

        {
          typeof label === "string" && label.length > 0 ?
              (
                <label
                  className={ CSS_Classes.label }
                  htmlFor={ inputElementID }
                >
                  { label }
                </label>
              ) :
              null
        }

        <input
          className={ CSS_Classes.nativeInputElement }
          type="text"
          id={ inputElementID }
          value={ value }
          disabled={ disabled }
          readOnly={ readonly }
          onChange={
            (event: React.ChangeEvent<HTMLInputElement>): void => {
              onChangeEventHandler(event.target.value, event);
            }
          }
          onBlur={
            (event: React.FocusEvent<HTMLInputElement>): void => {
              onBlurEventHandler?.(event.target.value, event);
            }
          }
          { ...nativeInputElementAttributes }
          ref={ inputElementReactReference }
        />
      </div>
    );

  }
);


namespace TextBox {

  export type Props = Readonly<{
    label?: string;
    value: string;
    className?: string;
    disabled?: boolean;
    readonly?: boolean;
    ref?: React.RefObject<TextBox.PublicMethods | null>;
    nativeInputElementAttributes?: Omit<React.ComponentProps<"input">, "id" | "type" | "disabled" | "readOnly">;
    onChangeEventHandler: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown;
    onBlurEventHandler?: (newestValue: string, event: React.FocusEvent<HTMLInputElement>) => unknown;
  }>;

  export interface PublicMethods {
    focus: () => void;
  }

}


export default TextBox;
