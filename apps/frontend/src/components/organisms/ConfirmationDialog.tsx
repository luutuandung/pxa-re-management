import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import Button from "@/components/atoms/Button"


class ConfirmationDialog extends React.Component {

  private sessionPromiseResolver: ((hasBeenConfirmed: boolean) => void) | null = null;


  /* ━━━ Interface ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static async executeSession(
    options: Omit<ConfirmationDialog.State, "isDisplaying">
  ): Promise<boolean> {

    const selfSingleInstance: ConfirmationDialog = ConfirmationDialog.getExpectedToBeInitializedSelfSingleInstance();

    selfSingleInstance.setState({
      isDisplaying: true,
      ...options
    });

    return new Promise<boolean>(
      (resolve: (hasBeenConfirmed: boolean) => void): void => {
        selfSingleInstance.sessionPromiseResolver = resolve;
      }
    );

  }


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public state: ConfirmationDialog.State = ConfirmationDialog.getInitialState();

  private static getInitialState(): ConfirmationDialog.State {
    return {
      isDisplaying: false,
      title: "",
      question: "",
      isDangerAction: false,
      confirmationButtonLabel: "Accept",
      cancellationButtonLabel: "Cancel"
    };
  }


  /* ━━━ Instancing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static selfSingleInstance: ConfirmationDialog | null = null;

  public override componentDidMount(): void {

    if (ConfirmationDialog.selfSingleInstance !== null) {
      throw new Error(
        "ConfirmationDialogコンポーネントが２回以上マウントしようとされているようだ。" +
          "ConfirmationDialogは一ページあたり一見のみでなければいけなく、呼び出したい時新しいインスタンスをレンダリングするのではなく、「display」制的メソッドを呼び出す事。"
      );
    }


    ConfirmationDialog.selfSingleInstance = this;

  }

  public override componentWillUnmount(): void {
    ConfirmationDialog.selfSingleInstance = null;
  }

  private static getExpectedToBeInitializedSelfSingleInstance(): ConfirmationDialog {
    return ConfirmationDialog.selfSingleInstance ??
        ((): never => {
          throw new Error("「ConfirmationDialog」コンポーネントがマウントされていないようだ。レイアウトコンポーネントにマウントする推薦。")
        })();
  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onConfirmationButtonClicked(): void {
    this.sessionPromiseResolver?.(true);
    this.sessionPromiseResolver = null;
    this.setState(ConfirmationDialog.getInitialState());
  }

  private onCancellationButtonClicked(): void {
    this.sessionPromiseResolver?.(false);
    this.sessionPromiseResolver = null;
    this.setState(ConfirmationDialog.getInitialState());
  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactNode {
    return (
      <Dialog
        open={ this.state.isDisplaying }
      >
        <DialogContent
          showCloseButton={ false }
          className="max-w-96 bg-white"
        >

          <DialogHeader>
            <DialogTitle>{ this.state.title }</DialogTitle>
            <DialogDescription>{ this.state.question }</DialogDescription>
          </DialogHeader>

          <DialogFooter>

            <Button
              variant="secondary"
              onClick={ this.onCancellationButtonClicked.bind(this) }
            >
              { this.state.cancellationButtonLabel }
            </Button>

            <Button
              variant={ this.state.isDangerAction ? "danger" : "primary" }
              onClick={ this.onConfirmationButtonClicked.bind(this) }
            >
              { this.state.confirmationButtonLabel }
            </Button>

          </DialogFooter>

        </DialogContent>
      </Dialog>
    )
  }

}


namespace ConfirmationDialog {

  export type State = Readonly<{
    isDisplaying: boolean;
    title: string;
    question: string;
    isDangerAction: boolean;
    confirmationButtonLabel: string;
    cancellationButtonLabel: string;
  }>;

}


export default ConfirmationDialog;
