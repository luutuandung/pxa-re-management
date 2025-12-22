import type ClientDependencies from "@/dependencies-injection/ClientDependencies.ts";


export default abstract class ClientDependenciesInjector {

  private static dependencies: ClientDependencies | null = null;


  public static setDependencies(dependencies: ClientDependencies): void {
    ClientDependenciesInjector.dependencies = dependencies;
  }


  /* ━━━ Accessors ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static get gateways(): ClientDependencies.Gateways {
    return ClientDependenciesInjector.getDependencies().gateways;
  }

  public static get BFF(): ClientDependencies.BFF {
    return ClientDependenciesInjector.getDependencies().BFF;
  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static getDependencies(): ClientDependencies {

    if (ClientDependenciesInjector.dependencies === null) {
      throw new Error("`ClientDependenciesInjector`を利用する前に、エントリーポイントで`setDependencies`制的メソッドで初期化する事。");
    }


    return ClientDependenciesInjector.dependencies;

  }

}
