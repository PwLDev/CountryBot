var guildCache = [];


window.onload = () => {
    const request = new XMLHttpRequest();
    request.open("GET", "/dashboard/guilds/cache");
    request.send();

    request.onreadystatechange = (e) => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const data = JSON.parse(request.response)

            data
            .forEach(guildData => {
                const { guild } = guildData
                if (!guildData.available) {
                    guildCache.push(`
                        <div class="guild">
                            <div class="title">
                                <img class="icon" src="${guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "../assets/profile.png"}"> 
                                <span style="display: block; font-size: 20px; font-weight: bold;">${guild.name}</span>
                            </div>
                            <div class="buttons">
                                <button class="invite" onclick="inviteBot()">Invitar Bot</button>
                            </div>
                        </div>
                    `)

                } else {
                    guildCache.unshift(`
                        <div class="guild">
                            <div class="title">
                                <img class="icon" src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon || "../profile.png"}">
                                <span style="display: block; font-size: 20px; font-weight: bold;">${guild.name}</span>
                            </div>
                            <div class="buttons">
                                <button class="guildedit" id="edit_guildId" onclick="window.location = '/dashboard/edit?guild=${guild.id}'">Configurar servidor</button>
                            </div>
                        </div>
                    `)
                }
            });

            setTimeout(() => {
                guildCache.forEach(html => {
                    document.getElementById("guilds")
                    .innerHTML += html
                });
            }, 1000);
        }
    }

    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("container").style.display = "block";
    }, 2500)
}