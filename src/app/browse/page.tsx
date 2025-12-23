import GridPageLayout from "@/components/grid-page/grid-page-layout";
import SearchRepository from "./_components/search-repository";
import Card from "@/components/card";
import AuthGuard from "@/components/auth/auth-guard";

export default function BrowsePage() {
  return (
    <div className="flex flex-col">
      <AuthGuard requireGitHubAccessToken withLoadingSpinner>
        <GridPageLayout>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              <SearchRepository />
              <Card></Card>
            </div>
          </div>
        </GridPageLayout>
      </AuthGuard>
    </div>
  );
}
