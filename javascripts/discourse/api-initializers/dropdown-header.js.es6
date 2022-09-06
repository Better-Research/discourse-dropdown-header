import { apiInitializer } from "discourse/lib/api";
import { ajax } from 'discourse/lib/ajax';

export default apiInitializer("0.11.1", (api) => {
  if (!settings.header_links) {
    return;
  }

  var headerLinks = JSON.parse(settings.header_links);

  const links_position =
    settings.links_position === "right"
      ? "header-buttons:before"
      : "home-logo:after";

  var user_tags = api.getCurrentUser().custom_fields["tags"];
  //console.log(user_tags);
  var items2 = [];
  user_tags.sort(function(a, b) {
    return parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]);
  });
  user_tags.forEach((tag) => {
    var description = ""
    ajax("/tag/" + tag + ".json").then(response =>  {
      return response
    }).then(data => {
        description = data["topic_list"]["tags"][0]["description"];
        items2.push({"headerLinkId":  0, "title": tag, "icon": "scroll", "url": "/tag/" + tag, "description": description})
    });
  });

  api.decorateWidget(links_position, (helper) => {
    const scrolling = helper.attrs.minimized;
    
    headerLinks[0]["user_tags"] = items2;
    return helper.widget.attach("custom-header-links", {
      headerLinks,
      scrolling,
    });
  });
});
