# CI-työnkulku ja rajapinnan testaus

Tässä tehtävässä toteutat GitHub Actions -työnkulun, joka käynnistää sovelluksen ja suorittaa kirjoittamasi testit sitä vasten. Lähtötilanteessa repositoriossa ei ole valmista työnkulkua tai testisarjaa.

Testattava sovellus on [`app`-kansiossa](./app/README.md). Se tarjoaa yksinkertaisen workout-REST-rajapinnan. Lue sovelluksen README:stä käynnistysohjeet, rajapinnan osoitteet ja odotettu toiminta. Sovellus käyttää muistia, joten sen tiedot häviävät, kun prosessi pysäytetään.

## Tausta ja oppimistavoitteet

Aiemmissa testaustehtävissä olet ehkä voinut kokeilla sovellusta käsin esimerkiksi painikkeita klikkaamalla. Tällä kertaa testattavalla sovelluksella ei ole käyttöliittymää: se tarjoaa rajapinnan toiselle kehitystiimille, joka voi myöhemmin integroida oman sovelluksensa siihen. Miten voit varmistaa, että rajapinta toimii odotetusti jo ennen kuin tuo käyttöliittymä on olemassa?

Pääset valitsemaan itse, miten lähestyt ongelmaa! Voit käyttää tuttua testaustyökalua, kokeilla uutta tai rakentaa testit vaikkapa `curl`-komennoilla ja Bash-skripteillä. Olennaista on, että testit tarkistavat tulokset ja että ne voidaan suorittaa automaattisesti GitHub Actionsissa.

Tehtävän jälkeen osaat:

- testata REST-rajapintaa lähettämällä HTTP-pyyntöjä, käyttämällä autentikointia ja tarkistamalla vastauksia ja virhetilanteita
- valita tehtävään sopivat työkalut ja asentaa niiden riippuvuudet automatisoidussa ympäristössä
- rakentaa CI-työnkulun, joka käynnistää sovelluksen, odottaa sen valmistumista ja suorittaa testit
- tulkita työnkulun tuloksia ja havaita testien tai sovelluksen käynnistyksen epäonnistumiset.

> [!TIP]
> Suosittelemme käyttämään kehitysympäristönä [GitHub Codespacesia](https://docs.github.com/en/codespaces/overview) tai paikallista [devcontaineria](https://code.visualstudio.com/docs/devcontainers/containers). Ne tarjoavat eristetyn ympäristön ja voivat helpottaa riippuvuuksien asentamista. Tässä repositoriossa ei ole valmista devcontainer-konfiguraatiota tai asennusskriptiä: Codespaces voi käyttää oletusympäristöä, ja paikallista devcontaineria varten voit luoda oman konfiguraation. Asenna sovelluksen ja valitsemasi testaustyökalun riippuvuudet käyttämääsi ympäristöön.

## Tehtävä

1. Tutustu rajapintaan ja käynnistä sovellus paikallisesti. Sovellus tarvitsee Node.js:n (vähintään version 22) ja npm:n.
2. Kirjoita oma automaattinen testisarja, joka lähettää HTTP-pyyntöjä käynnissä olevaan sovellukseen ja tarkistaa vastaukset. Testaa kirjautuminen ja suojattujen pyyntöjen toiminta myös ilman kelvollista tokenia. Testaa vähintään workoutin luonti, listaus, haku, päivitys ja poisto sekä virhetilanteita, kuten virheelliset syötteet ja tuntematon ID. Varmista myös päivityksen ja poiston vaikutus. Suunnittele testit niin, etteivät ne riipu aiempien testiajojen tiedoista.
3. Luo työnkulku `.github/workflows/`-kansioon. Määrittele sen käynnistymään vähintään push- ja pull request -tapahtumista. Käytä GitHubin ylläpitämiä uudelleenkäytettäviä actioneita repositorion hakemiseen ja Node.js-ympäristön asentamiseen, esimerkiksi [actions/checkout](https://github.com/actions/checkout) ja [actions/setup-node](https://github.com/actions/setup-node).
4. Asenna työnkulussa sovelluksen riippuvuudet (`npm ci` sovelluskansiossa) sekä valitsemasi testaustyökalun kaikki riippuvuudet. Käynnistä sovellus taustalle samalla runnerilla, jolla testit suoritetaan. Odota, kunnes se vastaa HTTP-pyyntöihin, ennen kuin käynnistät testit; käytä aikarajaa, jotta työnkulku epäonnistuu, jos sovellus ei käynnisty.
5. Suorita testisarjasi työnkulussa käynnissä olevaa sovellusta vasten. Varmista, että epäonnistunut testi tai käynnistysvirhe saa työnkulun epäonnistumaan. Lähetä testit, työnkulku ja mahdolliset riippuvuuksien määritykset GitHubiin ja tarkista suoritus repositorion Actions-välilehdeltä.

Voit valita testaustavan ja -työkalun itse. Esimerkiksi [Robot Framework](https://robotframework.org/), [Vitest](https://vitest.dev/) tai [Bruno CLI](https://docs.usebruno.com/bru-cli/overview) sopivat tehtävään, mutta voit käyttää myös `curl`-komentoja ja Bash-skriptejä. Työkalun on oltava suoritettavissa komentoriviltä automatisoidussa ympäristössä: pelkkä graafinen käyttöliittymä tai VS Code -laajennus ei riitä. Huolehdi myös työkalun tarvitsemasta ajoympäristöstä, kuten Pythonista, ja tallenna riippuvuudet repositorioon toistettavaa asennusta varten.

## Testattavat päätepisteet ja tilanteet

Kirjoita testit seuraaville päätepisteille ja tilanteille. Tarkista kussakin tapauksessa HTTP-tilakoodi ja tarvittaessa vastauksen sisältö, ei pelkästään sitä, että pyyntö onnistuu. Tarkemmat vastausmuodot ja esimerkkikäyttäjät löytyvät [sovelluksen README:stä](./app/README.md).

| Päätepiste | Testattavat tilanteet |
| --- | --- |
| `GET /` | Ilman kirjautumista palautuu tervetuloviesti ja `200`. |
| `GET /health` | Ilman kirjautumista palautuu `200` ja vastaus kertoo kyseessä olevan esimerkinomainen tarkistus. |
| `POST /auth/login` | Oikeilla tunnuksilla palautuu token; väärillä tunnuksilla `401`. Virheellinen JSON sekä puuttuvat tai väärän tyyppiset kentät palauttavat `400`. |
| `GET /workouts` | Kirjautuneena palautuu lista; varmista, että luotu workout näkyy siinä ja poistettu ei enää näy. |
| `POST /workouts` | Kelvollisilla tiedoilla palautuu `201`, luotu workout ja sen ID. Virheelliset syötteet palauttavat `400`. |
| `GET /workouts/:id` | Luotu workout löytyy ID:llä ja sen tiedot ovat oikein. Tuntematon ID palauttaa `404`. |
| `PUT /workouts/:id` | Kelvollinen päivitys palauttaa `200`, säilyttää ID:n ja muuttaa tiedot myös myöhemmässä haussa. Virheelliset syötteet palauttavat `400`, tuntematon ID `404`. |
| `DELETE /workouts/:id` | Luodun workoutin poisto palauttaa `204` ja tyhjän vastauksen. Poistettu tai tuntematon ID palauttaa myöhemmin `404`. |

Testaa myös jokaisen suojatun workout-päätepisteen kohdalla, että puuttuva tai virheellinen token palauttaa `401`. Kokeile luonnissa ja päivityksessä esimerkiksi puuttuvia kenttiä, tyhjää nimeä, virheellistä kestoa, ylimääräisiä kenttiä ja virheellistä JSONia. Varmista, ettei epäonnistunut päivitys muuta tallennettuja tietoja.

## Pisteytys

Saat osan tehtävän pisteistä, kun työnkulku asentaa riippuvuudet ja käynnistää sovelluksen onnistuneesti. Loput pisteistä saat omista testeistäsi: niiden tulee kattaa yllä kuvatut tilanteet, tarkistaa tulokset ja toimia GitHub Actionsissa. Voit siis saada osapisteitä, vaikka testisarjasi ei olisi vielä valmis.

## Vinkkejä

- Työnkulun komennot suoritetaan runnerilla; palvelin ja testit voivat käyttää samaa `http://localhost:3000`-osoitetta. Työvaiheiden oletushakemisto on repositorion juuri, joten huomioi `app`-kansio asennuksessa ja käynnistyksessä.
- Bashissa `&` käynnistää komennon taustalle. Katso [Bashin ohje taustaprosesseista](https://www.gnu.org/software/bash/manual/html_node/Lists.html) ja [GitHub Actionsin työnkulun syntaksi](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). Pelkkä taustakäynnistys ei tarkoita, että palvelin on jo valmis.
- Voit odottaa valmiutta esimerkiksi kokeilemalla `GET /health` -pyyntöä `curl`-komennolla toistuvasti rajatun ajan. Päätepiste ei vaadi tokenia, ja se vastaa `200`, kun palvelin vastaa. Huomaa, että kyseessä on vain esimerkinomainen tarkistus: se ei tarkista sovelluksen tilaa tai riippuvuuksia. Selvitä myös, miten havaitset käynnistysvirheen ja miten näet sovelluksen lokit epäonnistuessa.
- Sovelluksen README sisältää esimerkkikäyttäjät ja ohjeet tokenin hakemiseen. Hae token testiajon aikana, sillä se vanhenee ja muuttuu sovelluksen käynnistyessä uudelleen.
- Kun testaat yksittäistä workoutia, käytä luontivastauksen ID:tä. Sovellus käynnistyy tyhjällä tietovarastolla, mutta testit voivat muuttaa sitä saman ajon aikana.
