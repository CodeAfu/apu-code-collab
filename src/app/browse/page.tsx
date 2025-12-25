import GridPageLayout from "@/components/grid-page/grid-page-layout";
import AuthGuard from "@/components/auth/auth-guard";
import BrowseContents from "./_components/browse-contents";

export default function BrowsePage() {
  return (
    <div className="flex flex-col">
      <AuthGuard requireGitHubAccessToken withLoadingSpinner>
        <GridPageLayout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              <BrowseContents />

            </div>
          </div>
        </GridPageLayout>
      </AuthGuard>
    </div>
  );
}
