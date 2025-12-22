import CSS_Classes from "./PageTopHeading.module.sass"
import * as React from "react";


const PageTopHeading: React.FC<PageTopHeading.Props> = ({ className, children }: PageTopHeading.Props): React.ReactNode => (
  <h1
    className={
      [
        CSS_Classes.RootElement,
        ...typeof className === "string" ? [ className ] : []
      ].join(" ")
  }>
    { children }
  </h1>
);


namespace PageTopHeading {
  export type Props = Readonly<{
    className?: string;
    children: React.ReactNode;
  }>;
}


export default PageTopHeading;
