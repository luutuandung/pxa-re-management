import * as React from "react";


/* 【 参考 】 https://flowbite.com/docs/components/alerts/ */
class Alert extends React.Component<Alert.Props> {

  /* ━━━ ID生成 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static counterForInstanceID_Generating: number = 0;
  private readonly instanceID: string = `ALERT-${ ++Alert.counterForInstanceID_Generating }`;

  private readonly elementsHTML_IDs: Readonly<{
    root: string;
    button: string;
  }> = {
    root: this.instanceID,
    button: `${ this.instanceID }-BUTTON`
  }


  /* ━━━ 描画 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private get severityDependentCSS_ClassesForRootElement(): Array<string> {
    switch (this.props.severity) {
      case Alert.Severities.info: return [ "text-blue-800", "bg-blue-50", "dark:bg-gray-800", "dark:text-blue-400" ];
      case Alert.Severities.error: return [ "text-red-800", "bg-red-50", "dark:bg-gray-800", "dark:text-red-400" ];
      case Alert.Severities.success: return [ "text-green-800", "bg-green-50", "dark:bg-gray-800", "dark:text-green-400" ];
      case Alert.Severities.warning: return [ "text-yellow-800", "bg-yellow-50", "dark:bg-gray-800", "dark:text-yellow-300" ];
    }
  }

  private get severityDependentCSS_ClassesForButton(): Array<string> {
    switch (this.props.severity) {
      case Alert.Severities.info: return [
        "bg-blue-50",
        "text-blue-500",
        "focus:ring-2",
        "focus:ring-blue-400",
        "hover:bg-blue-200",
        "dark:bg-gray-800",
        "dark:text-blue-400",
        "dark:hover:bg-gray-700"
      ];
      case Alert.Severities.error: return [
        "bg-red-50",
        "text-red-500",
        "focus:ring-2",
        "focus:ring-red-400",
        "hover:bg-red-200",
        "dark:bg-gray-800",
        "dark:text-red-400",
        "dark:hover:bg-gray-700"
      ]
      case Alert.Severities.success: return [
        "bg-green-50",
        "text-green-500",
        "focus:ring-2",
        "focus:ring-green-400",
        "hover:bg-green-200",
        "dark:bg-gray-800",
        "dark:text-green-400",
        "dark:hover:bg-gray-700"
      ];
      case Alert.Severities.warning: return [
        "bg-yellow-50",
        "text-yellow-500",
        "focus:ring-2",
        "focus:ring-yellow-40",
        "hover:bg-yellow-200",
        "dark:bg-gray-800",
        "dark:text-yellow-300",
        "dark:hover:bg-gray-700"
      ];
    }
  }

  public render(): React.ReactNode {
    return (
      <div
        role="alert"
        className={
          [
            "flex",
            "items-center",
            "rounded-lg",
            "p-4",
            ...this.severityDependentCSS_ClassesForRootElement,
            ...typeof this.props.className === "string" ? [ this.props.className ] : []
          ].join(" ")
        }
        id={ this.elementsHTML_IDs.root }
      >

        <svg
          className="shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>

        <span className="sr-only">Info</span>

        <div className="ms-3 text-sm font-medium">
          { this.props.children }
        </div>

        {
          typeof this.props.onClickDismissingButton === "undefined" ?
              null :
              (
                <button
                  type="button"
                  className={
                    [
                      "inline-flex",
                      "items-center",
                      "justify-center",
                      "ms-auto",
                      "rounded-lg",
                      "-mx-1.5",
                      "-my-1.5",
                      "p-1.5",
                      "h-8",
                      "w-8",
                      ...this.severityDependentCSS_ClassesForButton
                    ].join(" ")
                  }
                  data-dismiss-target={ this.elementsHTML_IDs.root }
                  aria-label="Close"
                  onClick={ this.props.onClickDismissingButton.bind(this) }
                >

                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>

                </button>
              )
        }

      </div>
    );
  }

}


namespace Alert {

  export type Props = Readonly<{
    severity: Severities;
    children: React.ReactNode;
    onClickDismissingButton?: () => unknown;
    className?: string;
  }>;

  export enum Severities {
    info = "INFO",
    error = "ERROR",
    success = "SUCCESS",
    warning = "WARNING"
  }

}


export default Alert;
