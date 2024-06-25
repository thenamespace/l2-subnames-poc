import { useEffect, useState } from "react";
import { ScreenContainer } from "../components";
import { Listing } from "../api/types";
import { getListings } from "../api";
import { Button, Card, Typography } from "@ensdomains/thorin";
import { ListedNameCard } from "../components/select-names/ListedNameCard";
import "./NameSelectorPage.css";
import { Link } from "react-router-dom";

export const NameSelectorPage = () => {
  const [listedNames, setListedNames] = useState<{
    isFetching: boolean;
    items: Listing[];
  }>({
    isFetching: true,
    items: [],
  });
  const [selectedName, setSelectedName] = useState<Listing | null>(null);

  useEffect(() => {
    getListings("").then((res) => {
      setListedNames({
        isFetching: false,
        items: res,
      });
    });
  }, []);

  if (listedNames.isFetching) {
    return <ScreenContainer isLoading={true} />;
  }

  return (
    <ScreenContainer>
      <div className="name-selector-page">
        <Card className="name-page-card">
          <div>
            <Typography fontVariant="extraLarge">Select name</Typography>
            <Typography fontVariant="small" color="grey">
              Select under which name you want to mint subnames
            </Typography>
          </div>
          <div className="row no-gutters">
            {listedNames.items.map((i) => (
              <div
                onClick={() => setSelectedName(i)}
                className="col col-lg-6 card-container p-1"
                key={i.name}
              >
                <ListedNameCard
                  active={selectedName?.name === i.name}
                  name={i.name}
                  network={i.network}
                />
              </div>
            ))}
          </div>
          {selectedName && (
            <Link
              to={`/mint/${selectedName.name}?contract=${selectedName.contract}`}
            >
              <Button className="mt-4">Next</Button>
            </Link>
          )}
        </Card>
      </div>
    </ScreenContainer>
  );
};
