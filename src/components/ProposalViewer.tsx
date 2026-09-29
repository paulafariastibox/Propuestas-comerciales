import type { Proposal } from "../types";

interface Props {
  proposal: Proposal;
  remoteContentUrl?: string;
}

export function ProposalViewer({ proposal, remoteContentUrl }: Props) {
  if (proposal.format === "html") {
    if (proposal.contentHtml) {
      return (
        <iframe
          className="h-full w-full border-0 bg-white"
          title={proposal.title}
          srcDoc={proposal.contentHtml}
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
        />
      );
    }
    if (remoteContentUrl) {
      return (
        <iframe
          className="h-full w-full border-0 bg-white"
          title={proposal.title}
          src={remoteContentUrl}
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
        />
      );
    }
  }

  if (proposal.format === "pdf" && (proposal.contentUrl || remoteContentUrl)) {
    return (
      <iframe
        className="h-full w-full border-0 bg-white"
        title={proposal.title}
        src={proposal.contentUrl ?? remoteContentUrl}
      />
    );
  }

  if (proposal.format === "pptx") {
    return (
      <div className="grid h-full place-items-center bg-[#041327] p-8 text-center">
        <div className="max-w-lg">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-[#d94b38] text-2xl font-extrabold">P</div>
          <h2 className="text-2xl font-extrabold">PowerPoint preparado para conversión</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            En producción el backend convertirá el PPT/PPTX a PDF o imágenes para visualizarlo en el portal, manteniendo el archivo original en Blob Storage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full place-items-center bg-[#041327] p-8 text-center text-slate-400">
      No hay un archivo de propuesta disponible todavía.
    </div>
  );
}
