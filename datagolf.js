async function devig() {
  const response = await fetch(
    "http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open"
  );
  const data = await response.json();
  console.log(data);
}

devig();
