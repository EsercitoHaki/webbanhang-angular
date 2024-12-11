declare namespace google {
    namespace accounts {
      namespace id {
        interface CredentialResponse {
          credential: string;
          select_by: string;
        }
  
        interface RenderButtonOptions {
          theme?: string;
          size?: string;
        }
  
        function initialize(config: {
          client_id: string;
          callback: (response: CredentialResponse) => void;
        }): void;
  
        function renderButton(element: HTMLElement, options: RenderButtonOptions): void;
      }
    }
  }
  