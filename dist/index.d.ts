declare namespace Puffv {
  interface StreamWebSocket {
    type: "ws";
    url: string;
    protocol?: string;
    onopen?: () => void;
    onclose?: () => void;
    onerror?: (error: any) => void;
  }

  interface StreamSSE {
    type: "sse";
    url: string;
  }

  interface StreamCallback {
    (chart: Chart): any;
  }

  interface ChartOptions {
    type?: "bar" | "line" | "pie" | "radar";
    data?: number[];
    labels?: string[];

    animation?: "grow" | "fade" | "wave" | "explode" | null;
    duration?: number;

    theme?: "ocean" | "sunrise" | "neon" | "retro" | string[] | "auto";
    darkMode?: boolean;
    legend?: boolean;
    tooltip?: boolean;

    mode3D?: boolean;
    renderer?: "webgl" | "svg";
    width?: number;
    height?: number;

    zoomPan?: boolean;

    stream?: StreamWebSocket | StreamSSE | StreamCallback | null;
  }

  class Chart {
    constructor(selector: string | HTMLElement, options?: ChartOptions);

    render(): void;
    updateData(data: number[], labels?: string[]): void;
    pushDatum(value: number, label?: string): void;

    startStream(): void;
    stopStream(): void;
    destroy(): void;
  }
}

export = Puffv;
export as namespace Puffv;
